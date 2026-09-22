//go:build windows || plan9 || js

package judge

func wrapCommand(command string, limits structLimits) string { _ = limits; return command }
