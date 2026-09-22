package main

import (
	"testing"
	"time"
)

func TestSlugifyProjectName(t *testing.T) {
	tests := map[string]string{
		"Algorithm Training 2024": "algorithm-training-2024",
		"  Contest #1  ":          "contest-1",
		"中文项目":                    "untitled-project",
		"---":                     "untitled-project",
	}
	for input, expected := range tests {
		if actual := slugifyProjectName(input); actual != expected {
			t.Fatalf("slugifyProjectName(%q) = %q, want %q", input, actual, expected)
		}
	}
}

func TestSortProjectsByUpdatedAt(t *testing.T) {
	now := time.Now()
	projects := []Project{{Name: "old", UpdatedAt: now.Add(-time.Hour)}, {Name: "new", UpdatedAt: now}}
	sortProjects(projects)
	if projects[0].Name != "new" {
		t.Fatalf("first project = %q, want new", projects[0].Name)
	}
}
