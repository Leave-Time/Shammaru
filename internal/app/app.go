package app

import (
	"context"
	"errors"
	"strings"

	"Shammaru/internal/document"
	"Shammaru/internal/domain"
	exporter "Shammaru/internal/export"
	"Shammaru/internal/generator"
	"Shammaru/internal/judge"
	"Shammaru/internal/project"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx   context.Context
	store *project.Store
}

func New() *App {
	store, err := project.NewStore()
	if err != nil {
		panic(err)
	}
	return &App{store: store}
}

func (a *App) Startup(ctx context.Context) { a.ctx = ctx }

func (a *App) GetRecentProjects() ([]domain.Project, error) { return a.store.ListRecent() }

func (a *App) CreateProject(name string) (domain.Project, error) { return a.store.Create(name, "") }

func (a *App) OpenProjectDialog() (domain.Project, error) {
	if a.ctx == nil {
		return domain.Project{}, errors.New("desktop runtime is not initialized")
	}
	path, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{Title: "打开 Shammaru 项目"})
	if err != nil {
		return domain.Project{}, err
	}
	if strings.TrimSpace(path) == "" {
		return domain.Project{}, errors.New("project selection cancelled")
	}
	return a.store.Open(path)
}

func (a *App) OpenRecentProject(path string) (domain.Project, error) { return a.store.Open(path) }

func (a *App) CreateProblem(projectPath string, config domain.ProblemConfig) (domain.ProblemSummary, error) {
	return a.store.CreateProblem(projectPath, config)
}

func (a *App) GetProblem(projectPath, id string) (domain.ProblemSummary, error) {
	return a.store.ReadProblem(projectPath, id)
}

func (a *App) SaveProblemConfig(projectPath, id string, config domain.ProblemConfig) error {
	return a.store.SaveProblemConfig(projectPath, id, config)
}

func (a *App) ExportProject(request exporter.Request) error { return exporter.Package(request) }

func (a *App) RunCommand(request judge.Request) judge.Result {
	return judge.Run(context.Background(), request)
}

func (a *App) CompareOutput(checker domain.CheckerConfig, expected, actual string) (bool, error) {
	return judge.Compare(checker, expected, actual)
}

func (a *App) GenerateTests(request generator.Request) generator.Result {
	return generator.Generate(context.Background(), request)
}

func (a *App) BuildDocument(request document.Request) (document.Result, error) {
	return document.Compile(context.Background(), request)
}
