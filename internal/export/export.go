package exporter

import (
	"archive/zip"
	"encoding/xml"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"Shammaru/internal/domain"
	"gopkg.in/yaml.v3"
)

type Target string

const (
	TargetShammaru Target = "shammaru"
	TargetPolygon  Target = "polygon"
	TargetDomjudge Target = "domjudge"
)

type Request struct {
	ProjectPath string `json:"project_path"`
	Destination string `json:"destination"`
	Target      Target `json:"target"`
}

func Package(request Request) error {
	if request.Target == "" {
		request.Target = TargetShammaru
	}
	if request.ProjectPath == "" || request.Destination == "" {
		return fmt.Errorf("project path and destination are required")
	}
	if _, err := os.Stat(request.ProjectPath); err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(request.Destination), 0o755); err != nil {
		return err
	}
	stage, err := os.MkdirTemp("", "shammaru-export-")
	if err != nil {
		return err
	}
	defer os.RemoveAll(stage)
	switch request.Target {
	case TargetShammaru:
		if err := copyTree(request.ProjectPath, stage, true); err != nil {
			return err
		}
	case TargetPolygon:
		if err := buildPolygon(request.ProjectPath, stage); err != nil {
			return err
		}
	case TargetDomjudge:
		if err := buildDomjudge(request.ProjectPath, stage); err != nil {
			return err
		}
	default:
		return fmt.Errorf("unsupported export target %q", request.Target)
	}
	return zipDirectory(stage, request.Destination)
}

type polygonProblem struct {
	XMLName xml.Name       `xml:"problem"`
	Names   polygonNames   `xml:"names"`
	Judging polygonJudging `xml:"judging"`
}
type polygonNames struct {
	Name string `xml:"name"`
}
type polygonJudging struct {
	Testset polygonTestset `xml:"testset"`
}
type polygonTestset struct {
	Name string `xml:"name,attr"`
}

func buildPolygon(root, destination string) error {
	if err := copyTree(filepath.Join(root, "problems"), filepath.Join(destination, "problems"), false); err != nil {
		return err
	}
	entries, err := os.ReadDir(filepath.Join(root, "problems"))
	if err != nil {
		return err
	}
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		config, err := readProblem(filepath.Join(root, "problems", entry.Name(), "problem.yaml"))
		if err != nil {
			return err
		}
		content, err := xml.MarshalIndent(polygonProblem{Names: polygonNames{Name: config.Name}, Judging: polygonJudging{Testset: polygonTestset{Name: "tests"}}}, "", "  ")
		if err != nil {
			return err
		}
		if err := os.WriteFile(filepath.Join(destination, entry.Name()+".xml"), append([]byte(xml.Header), content...), 0o644); err != nil {
			return err
		}
	}
	return os.WriteFile(filepath.Join(destination, "shammaru-export.yaml"), []byte("format: polygon\nsource: Shammaru\n"), 0o644)
}

func buildDomjudge(root, destination string) error {
	if err := copyTree(filepath.Join(root, "problems"), filepath.Join(destination, "problems"), false); err != nil {
		return err
	}
	manifest := map[string]any{"format": "domjudge", "source": "Shammaru", "problems": []string{}}
	entries, err := os.ReadDir(filepath.Join(root, "problems"))
	if err != nil {
		return err
	}
	for _, entry := range entries {
		if entry.IsDir() {
			manifest["problems"] = append(manifest["problems"].([]string), entry.Name())
		}
	}
	data, err := yaml.Marshal(manifest)
	if err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(destination, "domjudge.yaml"), data, 0o644)
}

func readProblem(path string) (domain.ProblemConfig, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return domain.ProblemConfig{}, err
	}
	var config domain.ProblemConfig
	if err := yaml.Unmarshal(data, &config); err != nil {
		return config, err
	}
	return config, nil
}
func copyTree(source, destination string, includeHidden bool) error {
	info, err := os.Stat(source)
	if err != nil {
		return err
	}
	if !info.IsDir() {
		return fmt.Errorf("%s is not a directory", source)
	}
	return filepath.Walk(source, func(path string, fileInfo os.FileInfo, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		relative, err := filepath.Rel(source, path)
		if err != nil {
			return err
		}
		if relative == "." {
			return nil
		}
		if !includeHidden && strings.HasPrefix(fileInfo.Name(), ".") {
			if fileInfo.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}
		target := filepath.Join(destination, relative)
		if fileInfo.IsDir() {
			return os.MkdirAll(target, 0o755)
		}
		input, err := os.Open(path)
		if err != nil {
			return err
		}
		defer input.Close()
		output, err := os.OpenFile(target, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, fileInfo.Mode().Perm())
		if err != nil {
			return err
		}
		defer output.Close()
		_, err = io.Copy(output, input)
		return err
	})
}
func zipDirectory(root, destination string) error {
	output, err := os.Create(destination)
	if err != nil {
		return err
	}
	defer output.Close()
	archive := zip.NewWriter(output)
	defer archive.Close()
	return filepath.Walk(root, func(path string, info os.FileInfo, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if info.IsDir() {
			return nil
		}
		relative, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		entry, err := archive.Create(filepath.ToSlash(relative))
		if err != nil {
			return err
		}
		input, err := os.Open(path)
		if err != nil {
			return err
		}
		defer input.Close()
		_, err = io.Copy(entry, input)
		return err
	})
}
