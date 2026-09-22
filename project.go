package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/google/uuid"
)

// Project is the small persisted project descriptor used by the desktop shell.
type Project struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Path      string    `json:"path"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type projectIndex struct {
	Projects []Project `json:"projects"`
}

func projectIndexPath() (string, error) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", fmt.Errorf("resolve user config directory: %w", err)
	}
	return filepath.Join(configDir, "Shammaru", "projects.json"), nil
}

func readProjectIndex() (projectIndex, error) {
	indexPath, err := projectIndexPath()
	if err != nil {
		return projectIndex{}, err
	}
	data, err := os.ReadFile(indexPath)
	if errors.Is(err, os.ErrNotExist) {
		return projectIndex{Projects: []Project{}}, nil
	}
	if err != nil {
		return projectIndex{}, fmt.Errorf("read project index: %w", err)
	}
	var index projectIndex
	if err := json.Unmarshal(data, &index); err != nil {
		return projectIndex{}, fmt.Errorf("decode project index: %w", err)
	}
	return index, nil
}

func writeProjectIndex(index projectIndex) error {
	indexPath, err := projectIndexPath()
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(indexPath), 0o755); err != nil {
		return fmt.Errorf("create project config directory: %w", err)
	}
	data, err := json.MarshalIndent(index, "", "  ")
	if err != nil {
		return fmt.Errorf("encode project index: %w", err)
	}
	temporaryPath := indexPath + ".tmp"
	if err := os.WriteFile(temporaryPath, data, 0o600); err != nil {
		return fmt.Errorf("write project index: %w", err)
	}
	if err := os.Rename(temporaryPath, indexPath); err != nil {
		return fmt.Errorf("commit project index: %w", err)
	}
	return nil
}

func rememberProject(project Project) error {
	index, err := readProjectIndex()
	if err != nil {
		return err
	}
	projects := make([]Project, 0, len(index.Projects)+1)
	projects = append(projects, project)
	for _, existing := range index.Projects {
		if existing.Path != project.Path {
			projects = append(projects, existing)
		}
	}
	if len(projects) > 12 {
		projects = projects[:12]
	}
	index.Projects = projects
	return writeProjectIndex(index)
}

func sortProjects(projects []Project) {
	sort.SliceStable(projects, func(i, j int) bool { return projects[i].UpdatedAt.After(projects[j].UpdatedAt) })
}

func slugifyProjectName(name string) string {
	name = strings.TrimSpace(strings.ToLower(name))
	var builder strings.Builder
	for _, character := range name {
		if (character >= 'a' && character <= 'z') || (character >= '0' && character <= '9') {
			builder.WriteRune(character)
		} else if builder.Len() > 0 && !strings.HasSuffix(builder.String(), "-") {
			builder.WriteRune('-')
		}
	}
	result := strings.Trim(builder.String(), "-")
	if result == "" {
		return "untitled-project"
	}
	return result
}

func newProject(name, path string) (Project, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return Project{}, errors.New("project name is required")
	}
	path = strings.TrimSpace(path)
	if path == "" {
		configDir, err := os.UserConfigDir()
		if err != nil {
			return Project{}, fmt.Errorf("resolve project directory: %w", err)
		}
		path = filepath.Join(configDir, "Shammaru", "projects", slugifyProjectName(name))
	}
	path, err := filepath.Abs(path)
	if err != nil {
		return Project{}, fmt.Errorf("resolve project path: %w", err)
	}
	if err := os.MkdirAll(path, 0o755); err != nil {
		return Project{}, fmt.Errorf("create project directory: %w", err)
	}
	project := Project{ID: uuid.NewString(), Name: name, Path: path, UpdatedAt: time.Now().UTC()}
	metadataPath := filepath.Join(path, ".shammaru.json")
	data, err := json.MarshalIndent(project, "", "  ")
	if err != nil {
		return Project{}, fmt.Errorf("encode project metadata: %w", err)
	}
	if err := os.WriteFile(metadataPath, data, 0o600); err != nil {
		return Project{}, fmt.Errorf("write project metadata: %w", err)
	}
	if err := rememberProject(project); err != nil {
		return Project{}, err
	}
	return project, nil
}

func loadProject(path string) (Project, error) {
	path, err := filepath.Abs(strings.TrimSpace(path))
	if err != nil {
		return Project{}, fmt.Errorf("resolve project path: %w", err)
	}
	info, err := os.Stat(path)
	if err != nil {
		return Project{}, fmt.Errorf("inspect project path: %w", err)
	}
	if !info.IsDir() {
		return Project{}, errors.New("project path must be a directory")
	}
	metadataPath := filepath.Join(path, ".shammaru.json")
	data, err := os.ReadFile(metadataPath)
	if errors.Is(err, os.ErrNotExist) {
		return newProject(filepath.Base(path), path)
	}
	if err != nil {
		return Project{}, fmt.Errorf("read project metadata: %w", err)
	}
	var project Project
	if err := json.Unmarshal(data, &project); err != nil {
		return Project{}, fmt.Errorf("decode project metadata: %w", err)
	}
	project.Path = path
	project.UpdatedAt = time.Now().UTC()
	if project.Name == "" {
		project.Name = filepath.Base(path)
	}
	if project.ID == "" {
		project.ID = uuid.NewString()
	}
	if err := rememberProject(project); err != nil {
		return Project{}, err
	}
	return project, nil
}
