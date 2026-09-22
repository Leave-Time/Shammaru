# Shammaru Project Format

Shammaru projects are portable directories. A project contains multiple problems, each identified by a unique directory name under `problems/`.

```text
project/
├── project.yaml
├── problems/
│   └── {problem-id}/
│       ├── problem.yaml
│       ├── assets/
│       ├── docs/
│       │   ├── problem.md|tex|typ
│       │   ├── solution.md|tex|typ
│       │   └── build/
│       ├── src/
│       │   ├── generators/
│       │   ├── solutions/
│       │   ├── checker/
│       │   ├── validator/
│       │   └── interactor/
│       └── tests/
│           ├── sample/
│           ├── data/
│           └── manifest.yaml
├── templates/
├── exports/
└── .shammaru/
```

`project.yaml` stores project identity, supported language defaults and project-level document templates. `problem.yaml` stores problem type, limits, document entry points, checker, validator and expected solution verdicts. The supported problem types are `standard`, `output-only`, `interactive`, `communication`, `two-step` and `optimization`.

The first implementation supports C, C++, Java and Python language adapters. A language may override its compile and run command in `project.yaml`; command placeholders include `{source}`, `{binary}`, `{workdir}` and `{main_class}`.

Tests are generated or copied into `tests/data`, while examples belong in `tests/sample`. `tests/manifest.yaml` groups cases, scores, dependencies and generator invocations. Generated PDFs belong in `docs/build/`, and complete project exports are written to `exports/`.

Export targets are `shammaru`, `polygon` and `domjudge`.
