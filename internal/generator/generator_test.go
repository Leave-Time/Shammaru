package generator

import (
	"context"
	"os"
	"path/filepath"
	"testing"
)

func TestGenerate(t *testing.T) {
	root := t.TempDir()
	result := Generate(context.Background(), Request{ProblemRoot: root, GroupID: "small", Command: "printf 'seed={seed}\\n'", Count: 2})
	if result.Error != "" || len(result.Cases) != 2 {
		t.Fatalf("generation failed: %+v", result)
	}
	data, err := os.ReadFile(filepath.Join(root, "tests", "data", "small-01.in"))
	if err != nil {
		t.Fatal(err)
	}
	if string(data) != "seed=1\n" {
		t.Fatalf("case content = %q", data)
	}
}
