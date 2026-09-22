package main

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// GetRecentProjects returns projects most recently opened in the desktop app.
func (a *App) GetRecentProjects() ([]Project, error) {
	index, err := readProjectIndex()
	if err != nil {
		return nil, err
	}
	sortProjects(index.Projects)
	return index.Projects, nil
}

// CreateProject creates a project directory and persists it in the recent list.
func (a *App) CreateProject(name string) (Project, error) {
	return newProject(name, "")
}

// OpenProjectDialog opens the native directory picker and remembers the selection.
func (a *App) OpenProjectDialog() (Project, error) {
	if a.ctx == nil {
		return Project{}, errors.New("desktop runtime is not initialized")
	}
	path, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{Title: "打开 Shammaru 项目"})
	if err != nil {
		return Project{}, err
	}
	if strings.TrimSpace(path) == "" {
		return Project{}, errors.New("project selection cancelled")
	}
	return loadProject(path)
}

// OpenRecentProject opens a project path already known to the local index.
func (a *App) OpenRecentProject(path string) (Project, error) {
	return loadProject(path)
}
