package project

import (
	"os"
	"path/filepath"
	"testing"

	"Shammaru/internal/domain"
)

func TestCreateProjectAndProblemLayout(t *testing.T) {
	temporary := t.TempDir()
	store := &Store{indexPath: filepath.Join(temporary, "config", "projects.json")}
	project, err := store.Create("秋季赛", filepath.Join(temporary, "workspace"))
	if err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(filepath.Join(project.Path, "project.yaml")); err != nil {
		t.Fatal(err)
	}
	problem, err := store.CreateProblem(project.Path, domain.ProblemConfig{ID: "a-plus-b", Name: "A+B"})
	if err != nil {
		t.Fatal(err)
	}
	for _, directory := range []string{"assets", "docs", "src/generators", "src/solutions", "tests/sample", "tests/data"} {
		if _, err := os.Stat(filepath.Join(problem.Root, directory)); err != nil {
			t.Fatalf("missing %s: %v", directory, err)
		}
	}
	loaded, err := store.ReadProblem(project.Path, "a-plus-b")
	if err != nil {
		t.Fatal(err)
	}
	if loaded.Config.Documents.Statement.Format != "markdown" {
		t.Fatalf("statement format = %q", loaded.Config.Documents.Statement.Format)
	}
}
