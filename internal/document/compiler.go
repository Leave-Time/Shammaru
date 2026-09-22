package document

import (
	"context"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

type Format string

const (
	Markdown Format = "markdown"
	Latex    Format = "latex"
	Typst    Format = "typst"
)

type Request struct {
	Source    string `json:"source"`
	Output    string `json:"output"`
	Format    Format `json:"format"`
	WorkDir   string `json:"workdir"`
	Template  string `json:"template,omitempty"`
	TimeoutMS int    `json:"timeout_ms,omitempty"`
}

type Result struct {
	Output   string        `json:"output"`
	Command  string        `json:"command"`
	Duration time.Duration `json:"duration"`
}

func Compile(ctx context.Context, request Request) (Result, error) {
	if strings.TrimSpace(request.Source) == "" || strings.TrimSpace(request.Output) == "" {
		return Result{}, errors.New("source and output are required")
	}
	if request.Format == "" {
		request.Format = formatFromExtension(request.Source)
	}
	if request.Format != Markdown && request.Format != Latex && request.Format != Typst {
		return Result{}, fmt.Errorf("unsupported document format %q", request.Format)
	}
	if request.TimeoutMS <= 0 {
		request.TimeoutMS = 120000
	}
	if err := os.MkdirAll(filepath.Dir(request.Output), 0o755); err != nil {
		return Result{}, err
	}
	command, args := buildCommand(request)
	if _, err := exec.LookPath(command); err != nil {
		return Result{}, fmt.Errorf("required document compiler %q is not installed: %w", command, err)
	}
	compileContext, cancel := context.WithTimeout(ctx, time.Duration(request.TimeoutMS)*time.Millisecond)
	defer cancel()
	process := exec.CommandContext(compileContext, command, args...)
	process.Dir = request.WorkDir
	process.Env = os.Environ()
	output, err := process.CombinedOutput()
	result := Result{Output: string(output), Command: strings.Join(append([]string{command}, args...), " ")}
	if err != nil {
		if errors.Is(compileContext.Err(), context.DeadlineExceeded) {
			return result, errors.New("document compilation timed out")
		}
		return result, fmt.Errorf("document compilation failed: %w", err)
	}
	return result, nil
}

func formatFromExtension(source string) Format {
	switch strings.ToLower(filepath.Ext(source)) {
	case ".tex":
		return Latex
	case ".typ":
		return Typst
	default:
		return Markdown
	}
}

func buildCommand(request Request) (string, []string) {
	switch request.Format {
	case Latex:
		args := []string{"-pdf", "-interaction=nonstopmode", "-halt-on-error", "-outdir=" + filepath.Dir(request.Output), request.Source}
		return "latexmk", args
	case Typst:
		args := []string{"compile", "--root", request.WorkDir}
		if request.Template != "" {
			args = append(args, "--input", "template="+request.Template)
		}
		return "typst", append(args, request.Source, request.Output)
	default:
		args := []string{request.Source, "-o", request.Output}
		if request.Template != "" {
			args = append(args, "--template", request.Template)
		}
		return "pandoc", args
	}
}
