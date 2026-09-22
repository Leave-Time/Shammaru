//go:build linux || darwin || freebsd || openbsd || netbsd

package judge

import (
	"os/exec"
	"syscall"
)

func configureCommand(command *exec.Cmd) { command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true} }
