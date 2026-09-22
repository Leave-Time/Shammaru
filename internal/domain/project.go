package domain

type Project struct {
	ID        string `json:"id" yaml:"id"`
	Name      string `json:"name" yaml:"name"`
	Path      string `json:"path" yaml:"path"`
	Version   int    `json:"version" yaml:"version"`
	UpdatedAt string `json:"updatedAt" yaml:"updated_at"`
}

type ProjectConfig struct {
	ID        string                    `yaml:"id" json:"id"`
	Name      string                    `yaml:"name" json:"name"`
	Version   int                       `yaml:"version" json:"version"`
	Author    string                    `yaml:"author,omitempty" json:"author,omitempty"`
	Languages map[string]LanguageConfig `yaml:"languages,omitempty" json:"languages,omitempty"`
	Templates TemplateConfig            `yaml:"templates,omitempty" json:"templates,omitempty"`
}

type LanguageConfig struct {
	Version      string `yaml:"version,omitempty" json:"version,omitempty"`
	Compile      string `yaml:"compile,omitempty" json:"compile,omitempty"`
	Run          string `yaml:"run,omitempty" json:"run,omitempty"`
	SourceSuffix string `yaml:"source_suffix,omitempty" json:"source_suffix,omitempty"`
}

type TemplateConfig struct {
	Latex string `yaml:"latex,omitempty" json:"latex,omitempty"`
	Typst string `yaml:"typst,omitempty" json:"typst,omitempty"`
}

type ProblemConfig struct {
	ID          string             `yaml:"id" json:"id"`
	Name        string             `yaml:"name" json:"name"`
	Version     int                `yaml:"version" json:"version"`
	Type        ProblemType        `yaml:"type" json:"type"`
	Tags        []string           `yaml:"tags,omitempty" json:"tags,omitempty"`
	Languages   []string           `yaml:"languages" json:"languages"`
	Limits      ResourceLimits     `yaml:"limits" json:"limits"`
	Documents   DocumentsConfig    `yaml:"documents" json:"documents"`
	Templates   TemplateConfig     `yaml:"templates,omitempty" json:"templates,omitempty"`
	Evaluation  EvaluationConfig   `yaml:"evaluation" json:"evaluation"`
	Tests       TestsConfig        `yaml:"tests" json:"tests"`
	Interactive *InteractiveConfig `yaml:"interactive,omitempty" json:"interactive,omitempty"`
}

type ProblemType string

const (
	ProblemStandard      ProblemType = "standard"
	ProblemOutputOnly    ProblemType = "output-only"
	ProblemInteractive   ProblemType = "interactive"
	ProblemCommunication ProblemType = "communication"
	ProblemTwoStep       ProblemType = "two-step"
	ProblemOptimization  ProblemType = "optimization"
)

type ResourceLimits struct {
	TimeMS        int `yaml:"time_ms" json:"time_ms"`
	MemoryMB      int `yaml:"memory_mb" json:"memory_mb"`
	OutputKB      int `yaml:"output_kb" json:"output_kb"`
	StackMB       int `yaml:"stack_mb,omitempty" json:"stack_mb,omitempty"`
	IdleTimeoutMS int `yaml:"idle_timeout_ms,omitempty" json:"idle_timeout_ms,omitempty"`
}

type DocumentsConfig struct {
	Statement DocumentEntry `yaml:"statement" json:"statement"`
	Solution  DocumentEntry `yaml:"solution" json:"solution"`
}

type DocumentEntry struct {
	Source string `yaml:"source" json:"source"`
	Format string `yaml:"format" json:"format"`
	PDF    string `yaml:"pdf,omitempty" json:"pdf,omitempty"`
}

type EvaluationConfig struct {
	Checker   CheckerConfig  `yaml:"checker" json:"checker"`
	Answer    AnswerConfig   `yaml:"answer" json:"answer"`
	Validator ProgramRef     `yaml:"validator,omitempty" json:"validator,omitempty"`
	Solutions []SolutionSpec `yaml:"solutions" json:"solutions"`
}

type AnswerConfig struct {
	Mode      string `yaml:"mode" json:"mode"`
	Source    string `yaml:"source,omitempty" json:"source,omitempty"`
	StaticDir string `yaml:"static_dir,omitempty" json:"static_dir,omitempty"`
}

type CheckerConfig struct {
	Type          string  `yaml:"type" json:"type"`
	Source        string  `yaml:"source,omitempty" json:"source,omitempty"`
	AbsoluteError float64 `yaml:"absolute_error,omitempty" json:"absolute_error,omitempty"`
	RelativeError float64 `yaml:"relative_error,omitempty" json:"relative_error,omitempty"`
}

type ProgramRef struct {
	Source   string `yaml:"source" json:"source"`
	Language string `yaml:"language,omitempty" json:"language,omitempty"`
}

type SolutionSpec struct {
	Name     string   `yaml:"name" json:"name"`
	Source   string   `yaml:"source" json:"source"`
	Language string   `yaml:"language" json:"language"`
	Expected Verdict  `yaml:"expected" json:"expected"`
	Score    *float64 `yaml:"score,omitempty" json:"score,omitempty"`
}

type Verdict string

const (
	VerdictAccepted            Verdict = "accepted"
	VerdictWrongAnswer         Verdict = "wrong_answer"
	VerdictPartial             Verdict = "partial"
	VerdictTimeLimitExceeded   Verdict = "time_limit_exceeded"
	VerdictMemoryLimitExceeded Verdict = "memory_limit_exceeded"
	VerdictRuntimeError        Verdict = "runtime_error"
	VerdictCompileError        Verdict = "compile_error"
)

type TestsConfig struct {
	Manifest string `yaml:"manifest" json:"manifest"`
}

type InteractiveConfig struct {
	Interactor ProgramRef `yaml:"interactor" json:"interactor"`
	Protocol   string     `yaml:"protocol,omitempty" json:"protocol,omitempty"`
}

type TestManifest struct {
	Groups []TestGroup `yaml:"groups" json:"groups"`
}

type TestGroup struct {
	ID           string          `yaml:"id" json:"id"`
	Score        float64         `yaml:"score" json:"score"`
	Dependencies []string        `yaml:"dependencies,omitempty" json:"dependencies,omitempty"`
	Cases        []TestCase      `yaml:"cases,omitempty" json:"cases,omitempty"`
	Generators   []GeneratorSpec `yaml:"generators,omitempty" json:"generators,omitempty"`
}

type TestCase struct {
	ID     string `yaml:"id" json:"id"`
	Input  string `yaml:"input" json:"input"`
	Output string `yaml:"output,omitempty" json:"output,omitempty"`
}

type GeneratorSpec struct {
	Name      string            `yaml:"name" json:"name"`
	Source    string            `yaml:"source" json:"source"`
	Language  string            `yaml:"language" json:"language"`
	Count     int               `yaml:"count" json:"count"`
	Seeds     []int64           `yaml:"seeds,omitempty" json:"seeds,omitempty"`
	Arguments map[string]string `yaml:"arguments,omitempty" json:"arguments,omitempty"`
}

type ProblemSummary struct {
	Config ProblemConfig `json:"config"`
	Root   string        `json:"root"`
	Files  []string      `json:"files"`
}
