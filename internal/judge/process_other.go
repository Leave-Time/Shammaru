//go:build windows || plan9 || js

package judge

import "os/exec"

func configureCommand(command *exec.Cmd) { _ = command }
