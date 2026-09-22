//go:build linux || darwin || freebsd || openbsd || netbsd

package judge

import "fmt"

func wrapCommand(command string, limits structLimits) string {
	parts := ""
	if limits.MemoryMB > 0 {
		parts += fmt.Sprintf("ulimit -v %d; ", limits.MemoryMB*1024)
	}
	if limits.OutputKB > 0 {
		parts += fmt.Sprintf("ulimit -f %d; ", (limits.OutputKB*1024+511)/512)
	}
	return parts + "exec " + command
}
