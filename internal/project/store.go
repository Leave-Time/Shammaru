package project

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"

	"Shammaru/internal/domain"
	"github.com/google/uuid"
	"gopkg.in/yaml.v3"
)

var validID = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$`)

type index struct {
	Projects []domain.Project `json:"projects"`
}

type Store struct{ indexPath string }

func NewStore() (*Store, error) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return nil, fmt.Errorf("resolve user config directory: %w", err)
	}
	return &Store{indexPath: filepath.Join(configDir, "Shammaru", "projects.json")}, nil
}

func (s *Store) ListRecent() ([]domain.Project, error) {
	data, err := os.ReadFile(s.indexPath)
	if errors.Is(err, os.ErrNotExist) {
		return []domain.Project{}, nil
	}
	if err != nil {
		return nil, fmt.Errorf("read recent projects: %w", err)
	}
	var value index
	if err := json.Unmarshal(data, &value); err != nil {
		return nil, fmt.Errorf("decode recent projects: %w", err)
	}
	sort.SliceStable(value.Projects, func(i, j int) bool { return value.Projects[i].UpdatedAt > value.Projects[j].UpdatedAt })
	return value.Projects, nil
}

func (s *Store) remember(value domain.Project) error {
	projects, err := s.ListRecent()
	if err != nil {
		return err
	}
	result := []domain.Project{value}
	for _, existing := range projects {
		if existing.Path != value.Path {
			result = append(result, existing)
		}
	}
	if len(result) > 20 {
		result = result[:20]
	}
	data, err := json.MarshalIndent(index{Projects: result}, "", "  ")
	if err != nil {
		return fmt.Errorf("encode recent projects: %w", err)
	}
	if err := os.MkdirAll(filepath.Dir(s.indexPath), 0o755); err != nil {
		return fmt.Errorf("create config directory: %w", err)
	}
	temporary := s.indexPath + ".tmp"
	if err := os.WriteFile(temporary, data, 0o600); err != nil {
		return fmt.Errorf("write recent projects: %w", err)
	}
	if err := os.Rename(temporary, s.indexPath); err != nil {
		return fmt.Errorf("commit recent projects: %w", err)
	}
	return nil
}

func validateID(id string) error {
	if !validID.MatchString(id) {
		return fmt.Errorf("invalid id %q: use 1-64 letters, numbers, _ or -", id)
	}
	return nil
}

func slug(name string) string {
	var result strings.Builder
	for _, r := range strings.ToLower(strings.TrimSpace(name)) {
		if r >= 'a' && r <= 'z' || r >= '0' && r <= '9' {
			result.WriteRune(r)
		} else if result.Len() > 0 && !strings.HasSuffix(result.String(), "-") {
			result.WriteByte('-')
		}
	}
	value := strings.Trim(result.String(), "-")
	if value == "" {
		return "untitled-project"
	}
	return value
}

func (s *Store) Create(name, requestedPath string) (domain.Project, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return domain.Project{}, errors.New("project name is required")
	}
	path := strings.TrimSpace(requestedPath)
	if path == "" {
		configDir, err := os.UserConfigDir()
		if err != nil {
			return domain.Project{}, fmt.Errorf("resolve project directory: %w", err)
		}
		path = filepath.Join(configDir, "Shammaru", "projects", slug(name))
	}
	path, err := filepath.Abs(path)
	if err != nil {
		return domain.Project{}, fmt.Errorf("resolve project path: %w", err)
	}
	if err := os.MkdirAll(path, 0o755); err != nil {
		return domain.Project{}, fmt.Errorf("create project directory: %w", err)
	}
	project := domain.Project{ID: uuid.NewString(), Name: name, Path: path, Version: 1, UpdatedAt: time.Now().UTC().Format(time.RFC3339Nano)}
	config := domain.ProjectConfig{ID: project.ID, Name: name, Version: 1, Languages: defaultLanguages()}
	if err := writeYAML(filepath.Join(path, "project.yaml"), config); err != nil {
		return domain.Project{}, err
	}
	if err := os.MkdirAll(filepath.Join(path, "problems"), 0o755); err != nil {
		return domain.Project{}, fmt.Errorf("create problems directory: %w", err)
	}
	for _, directory := range []string{"templates/latex", "templates/typst", "exports", ".shammaru/build", ".shammaru/cache", ".shammaru/reports"} {
		if err := os.MkdirAll(filepath.Join(path, directory), 0o755); err != nil {
			return domain.Project{}, fmt.Errorf("create project layout: %w", err)
		}
	}
	if err := s.remember(project); err != nil {
		return domain.Project{}, err
	}
	return project, nil
}

func defaultLanguages() map[string]domain.LanguageConfig {
	return map[string]domain.LanguageConfig{
		"c":      {Version: "c17", Compile: "gcc {source} -O2 -std=c17 -o {binary}", Run: "{binary}", SourceSuffix: ".c"},
		"cpp":    {Version: "c++17", Compile: "g++ {source} -O2 -std=c++17 -o {binary}", Run: "{binary}", SourceSuffix: ".cpp"},
		"java":   {Version: "21", Compile: "javac -encoding UTF-8 -d {workdir} {source}", Run: "java -cp {workdir} {main_class}", SourceSuffix: ".java"},
		"python": {Version: "3.12", Run: "python3 {source}", SourceSuffix: ".py"},
	}
}

func (s *Store) Open(path string) (domain.Project, error) {
	path, err := filepath.Abs(strings.TrimSpace(path))
	if err != nil {
		return domain.Project{}, fmt.Errorf("resolve project path: %w", err)
	}
	info, err := os.Stat(path)
	if err != nil {
		return domain.Project{}, fmt.Errorf("inspect project path: %w", err)
	}
	if !info.IsDir() {
		return domain.Project{}, errors.New("project path must be a directory")
	}
	config, err := readYAML[domain.ProjectConfig](filepath.Join(path, "project.yaml"))
	if err != nil {
		return domain.Project{}, fmt.Errorf("open project: %w", err)
	}
	project := domain.Project{ID: config.ID, Name: config.Name, Path: path, Version: config.Version, UpdatedAt: time.Now().UTC().Format(time.RFC3339Nano)}
	if project.ID == "" {
		project.ID = uuid.NewString()
	}
	if project.Name == "" {
		project.Name = filepath.Base(path)
	}
	if err := s.remember(project); err != nil {
		return domain.Project{}, err
	}
	return project, nil
}

func (s *Store) CreateProblem(projectPath string, config domain.ProblemConfig) (domain.ProblemSummary, error) {
	if err := validateID(config.ID); err != nil {
		return domain.ProblemSummary{}, err
	}
	if strings.TrimSpace(config.Name) == "" {
		return domain.ProblemSummary{}, errors.New("problem name is required")
	}
	root := filepath.Join(projectPath, "problems", config.ID)
	if err := os.MkdirAll(root, 0o755); err != nil {
		return domain.ProblemSummary{}, fmt.Errorf("create problem directory: %w", err)
	}
	for _, directory := range []string{"assets", "docs/build", "src/generators", "src/solutions", "src/checker", "src/validator", "src/interactor", "tests/sample", "tests/data"} {
		if err := os.MkdirAll(filepath.Join(root, directory), 0o755); err != nil {
			return domain.ProblemSummary{}, fmt.Errorf("create problem layout: %w", err)
		}
	}
	if config.Version == 0 {
		config.Version = 1
	}
	if config.Type == "" {
		config.Type = domain.ProblemStandard
	}
	if config.Limits.TimeMS == 0 {
		config.Limits.TimeMS = 1000
	}
	if config.Limits.MemoryMB == 0 {
		config.Limits.MemoryMB = 512
	}
	if config.Limits.OutputKB == 0 {
		config.Limits.OutputKB = 1024
	}
	if config.Documents.Statement.Source == "" {
		config.Documents.Statement = domain.DocumentEntry{Source: "docs/problem.md", Format: "markdown", PDF: "docs/build/problem.pdf"}
	}
	if config.Documents.Solution.Source == "" {
		config.Documents.Solution = domain.DocumentEntry{Source: "docs/solution.md", Format: "markdown", PDF: "docs/build/solution.pdf"}
	}
	if config.Evaluation.Checker.Type == "" {
		config.Evaluation.Checker.Type = "diff"
	}
	if config.Tests.Manifest == "" {
		config.Tests.Manifest = "tests/manifest.yaml"
	}
	if err := writeYAML(filepath.Join(root, "problem.yaml"), config); err != nil {
		return domain.ProblemSummary{}, err
	}
	if err := writeYAML(filepath.Join(root, "tests/manifest.yaml"), domain.TestManifest{Groups: []domain.TestGroup{}}); err != nil {
		return domain.ProblemSummary{}, err
	}
	for path, content := range map[string]string{"docs/problem.md": "# " + config.Name + "\n\n题面待编写。\n", "docs/solution.md": "# 题解\n\n题解待编写。\n"} {
		if err := os.WriteFile(filepath.Join(root, path), []byte(content), 0o644); err != nil {
			return domain.ProblemSummary{}, err
		}
	}
	return s.ReadProblem(projectPath, config.ID)
}

func (s *Store) ReadProblem(projectPath, id string) (domain.ProblemSummary, error) {
	if err := validateID(id); err != nil {
		return domain.ProblemSummary{}, err
	}
	root := filepath.Join(projectPath, "problems", id)
	config, err := readYAML[domain.ProblemConfig](filepath.Join(root, "problem.yaml"))
	if err != nil {
		return domain.ProblemSummary{}, fmt.Errorf("read problem: %w", err)
	}
	var files []string
	err = filepath.WalkDir(root, func(path string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if entry.IsDir() || filepath.Base(path) == ".shammaru" {
			return nil
		}
		relative, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		files = append(files, filepath.ToSlash(relative))
		return nil
	})
	if err != nil {
		return domain.ProblemSummary{}, err
	}
	sort.Strings(files)
	return domain.ProblemSummary{Config: config, Root: root, Files: files}, nil
}

func (s *Store) SaveProblemConfig(projectPath, id string, config domain.ProblemConfig) error {
	if err := validateID(id); err != nil {
		return err
	}
	if config.ID != id {
		return errors.New("problem config id does not match path")
	}
	return writeYAML(filepath.Join(projectPath, "problems", id, "problem.yaml"), config)
}

func writeYAML(path string, value any) error {
	data, err := yaml.Marshal(value)
	if err != nil {
		return fmt.Errorf("encode %s: %w", filepath.Base(path), err)
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	if err := os.WriteFile(path, data, 0o644); err != nil {
		return fmt.Errorf("write %s: %w", path, err)
	}
	return nil
}
func readYAML[T any](path string) (T, error) {
	var value T
	data, err := os.ReadFile(path)
	if err != nil {
		return value, err
	}
	if err := yaml.Unmarshal(data, &value); err != nil {
		return value, err
	}
	return value, nil
}
