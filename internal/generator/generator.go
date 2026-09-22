package generator

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"Shammaru/internal/domain"
	"Shammaru/internal/judge"
)

type Request struct {
	ProblemRoot string                `json:"problem_root"`
	GroupID     string                `json:"group_id"`
	Command     string                `json:"command"`
	Count       int                   `json:"count"`
	Seeds       []int64               `json:"seeds,omitempty"`
	Limits      domain.ResourceLimits `json:"limits"`
}
type GeneratedCase struct {
	Index int    `json:"index"`
	Seed  int64  `json:"seed"`
	Path  string `json:"path"`
}
type Result struct {
	Cases []GeneratedCase `json:"cases"`
	Error string          `json:"error,omitempty"`
}

func Generate(ctx context.Context, request Request) Result {
	result := Result{}
	if request.ProblemRoot == "" || request.GroupID == "" || request.Command == "" {
		result.Error = "problem root, group id and command are required"
		return result
	}
	if request.Count <= 0 {
		request.Count = len(request.Seeds)
		if request.Count == 0 {
			request.Count = 1
		}
	}
	if err := os.MkdirAll(filepath.Join(request.ProblemRoot, "tests", "data"), 0o755); err != nil {
		result.Error = err.Error()
		return result
	}
	for index := 0; index < request.Count; index++ {
		seed := int64(index + 1)
		if index < len(request.Seeds) {
			seed = request.Seeds[index]
		}
		command := strings.NewReplacer("{seed}", strconv.FormatInt(seed, 10), "{index}", strconv.Itoa(index+1)).Replace(request.Command)
		run := judge.Run(ctx, judge.Request{Command: command, WorkDir: request.ProblemRoot, Limits: request.Limits})
		if run.Verdict != domain.VerdictAccepted {
			result.Error = fmt.Sprintf("generator case %d failed: %s", index+1, run.Error)
			return result
		}
		path := filepath.Join(request.ProblemRoot, "tests", "data", fmt.Sprintf("%s-%02d.in", request.GroupID, index+1))
		if err := os.WriteFile(path, []byte(run.Stdout), 0o644); err != nil {
			result.Error = err.Error()
			return result
		}
		result.Cases = append(result.Cases, GeneratedCase{Index: index + 1, Seed: seed, Path: path})
	}
	return result
}
