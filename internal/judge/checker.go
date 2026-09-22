package judge

import (
	"fmt"
	"math"
	"strconv"
	"strings"

	"Shammaru/internal/domain"
)

func Compare(checker domain.CheckerConfig, expected, actual string) (bool, error) {
	switch checker.Type {
	case "diff", "exact":
		return normalize(expected) == normalize(actual), nil
	case "token":
		return compareTokens(expected, actual), nil
	case "float":
		return compareFloats(checker, expected, actual)
	case "custom":
		return false, fmt.Errorf("custom checker must be executed as a checker program")
	default:
		return false, fmt.Errorf("unsupported checker type %q", checker.Type)
	}
}

func normalize(value string) string {
	return strings.TrimSpace(strings.ReplaceAll(value, "\r\n", "\n"))
}
func compareTokens(expected, actual string) bool {
	left, right := strings.Fields(expected), strings.Fields(actual)
	if len(left) != len(right) {
		return false
	}
	for i := range left {
		if left[i] != right[i] {
			return false
		}
	}
	return true
}
func compareFloats(checker domain.CheckerConfig, expected, actual string) (bool, error) {
	left, right := strings.Fields(expected), strings.Fields(actual)
	if len(left) != len(right) {
		return false, nil
	}
	absolute := checker.AbsoluteError
	relative := checker.RelativeError
	if absolute == 0 {
		absolute = 1e-6
	}
	if relative == 0 {
		relative = 1e-6
	}
	for i := range left {
		expectedValue, err := strconv.ParseFloat(left[i], 64)
		if err != nil {
			return false, fmt.Errorf("parse expected float %q: %w", left[i], err)
		}
		actualValue, err := strconv.ParseFloat(right[i], 64)
		if err != nil {
			return false, fmt.Errorf("parse actual float %q: %w", right[i], err)
		}
		difference := math.Abs(expectedValue - actualValue)
		limit := math.Max(absolute, relative*math.Abs(expectedValue))
		if difference > limit {
			return false, nil
		}
	}
	return true, nil
}
