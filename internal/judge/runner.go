package judge

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"Shammaru/internal/domain"
)

type Request struct {
	Command   string
	WorkDir   string
	Source    string
	Binary    string
	Input     string
	Output    string
	MainClass string
	Limits    domain.ResourceLimits
}

type structLimits = domain.ResourceLimits

type Result struct {
	Verdict  domain.Verdict `json:"verdict"`
	ExitCode int            `json:"exit_code"`
	Duration time.Duration  `json:"duration"`
	Stdout   string         `json:"stdout"`
	Stderr   string         `json:"stderr"`
	Error    string         `json:"error,omitempty"`
}

func Run(ctx context.Context, request Request) Result {
	started := time.Now()
	result := Result{Verdict: domain.VerdictRuntimeError}
	if strings.TrimSpace(request.Command) == "" {
		result.Error = "command is required"
		result.Duration = time.Since(started)
		return result
	}
	timeout := time.Duration(request.Limits.TimeMS) * time.Millisecond
	if timeout <= 0 {
		timeout = time.Second
	}
	runContext, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()
	command, args := shellCommand(wrapCommand(request.Command, request.Limits))
	process := exec.CommandContext(runContext, command, args...)
	process.Dir = request.WorkDir
	configureCommand(process)
	process.Env = append(os.Environ(), "SHAMMARU_SOURCE="+request.Source, "SHAMMARU_BINARY="+request.Binary, "SHAMMARU_INPUT="+request.Input, "SHAMMARU_OUTPUT="+request.Output, "SHAMMARU_MAIN_CLASS="+request.MainClass)
	var combined bytes.Buffer
	process.Stdout = &limitedWriter{buffer: &combined, limit: outputLimit(request.Limits.OutputKB)}
	process.Stderr = &limitedWriter{buffer: &combined, limit: outputLimit(request.Limits.OutputKB)}
	err := process.Run()
	result.Duration = time.Since(started)
	result.Stdout = combined.String()
	if errors.Is(runContext.Err(), context.DeadlineExceeded) {
		result.Verdict = domain.VerdictTimeLimitExceeded
		result.Error = "time limit exceeded"
		return result
	}
	if err == nil {
		result.Verdict = domain.VerdictAccepted
		result.ExitCode = 0
		return result
	}
	var exitError *exec.ExitError
	if errors.As(err, &exitError) {
		result.ExitCode = exitError.ExitCode()
	}
	result.Error = err.Error()
	if strings.Contains(result.Error, "output limit") {
		result.Verdict = domain.VerdictRuntimeError
	}
	return result
}

func shellCommand(command string) (string, []string) {
	if filepath.Separator == '\\' {
		return "cmd", []string{"/C", command}
	}
	return "sh", []string{"-c", command}
}
func outputLimit(kilobytes int) int64 {
	if kilobytes <= 0 {
		kilobytes = 1024
	}
	return int64(kilobytes) * 1024
}

type limitedWriter struct {
	buffer  *bytes.Buffer
	limit   int64
	written int64
}

func (w *limitedWriter) Write(value []byte) (int, error) {
	remaining := w.limit - w.written
	if remaining <= 0 {
		return 0, fmt.Errorf("output limit exceeded")
	}
	if int64(len(value)) > remaining {
		value = value[:remaining]
		w.buffer.Write(value)
		w.written += int64(len(value))
		return len(value), fmt.Errorf("output limit exceeded")
	}
	count, err := w.buffer.Write(value)
	w.written += int64(count)
	return count, err
}
