package judge

import (
	"context"
	"strings"
	"testing"

	"Shammaru/internal/domain"
)

func TestRunKeepsEnvironment(t *testing.T) {
	result := Run(context.Background(), Request{Command: "printf '%s' \"$PATH\"", Limits: domain.ResourceLimits{TimeMS: 1000, OutputKB: 64}})
	if result.Verdict != domain.VerdictAccepted {
		t.Fatalf("verdict = %q, error = %q", result.Verdict, result.Error)
	}
	if strings.TrimSpace(result.Stdout) == "" {
		t.Fatal("expected inherited PATH")
	}
}
