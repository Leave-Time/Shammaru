export namespace domain {
	
	export class CheckerConfig {
	    type: string;
	    source?: string;
	    absolute_error?: number;
	    relative_error?: number;
	
	    static createFrom(source: any = {}) {
	        return new CheckerConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.source = source["source"];
	        this.absolute_error = source["absolute_error"];
	        this.relative_error = source["relative_error"];
	    }
	}
	export class DocumentEntry {
	    source: string;
	    format: string;
	    pdf?: string;
	
	    static createFrom(source: any = {}) {
	        return new DocumentEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.source = source["source"];
	        this.format = source["format"];
	        this.pdf = source["pdf"];
	    }
	}
	export class DocumentsConfig {
	    statement: DocumentEntry;
	    solution: DocumentEntry;
	
	    static createFrom(source: any = {}) {
	        return new DocumentsConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.statement = this.convertValues(source["statement"], DocumentEntry);
	        this.solution = this.convertValues(source["solution"], DocumentEntry);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class SolutionSpec {
	    name: string;
	    source: string;
	    language: string;
	    expected: string;
	    score?: number;
	
	    static createFrom(source: any = {}) {
	        return new SolutionSpec(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.source = source["source"];
	        this.language = source["language"];
	        this.expected = source["expected"];
	        this.score = source["score"];
	    }
	}
	export class ProgramRef {
	    source: string;
	    language?: string;
	
	    static createFrom(source: any = {}) {
	        return new ProgramRef(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.source = source["source"];
	        this.language = source["language"];
	    }
	}
	export class EvaluationConfig {
	    checker: CheckerConfig;
	    validator?: ProgramRef;
	    solutions: SolutionSpec[];
	
	    static createFrom(source: any = {}) {
	        return new EvaluationConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.checker = this.convertValues(source["checker"], CheckerConfig);
	        this.validator = this.convertValues(source["validator"], ProgramRef);
	        this.solutions = this.convertValues(source["solutions"], SolutionSpec);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class InteractiveConfig {
	    interactor: ProgramRef;
	    protocol?: string;
	
	    static createFrom(source: any = {}) {
	        return new InteractiveConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.interactor = this.convertValues(source["interactor"], ProgramRef);
	        this.protocol = source["protocol"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TestsConfig {
	    manifest: string;
	
	    static createFrom(source: any = {}) {
	        return new TestsConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.manifest = source["manifest"];
	    }
	}
	export class ResourceLimits {
	    time_ms: number;
	    memory_mb: number;
	    output_kb: number;
	    stack_mb?: number;
	    idle_timeout_ms?: number;
	
	    static createFrom(source: any = {}) {
	        return new ResourceLimits(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.time_ms = source["time_ms"];
	        this.memory_mb = source["memory_mb"];
	        this.output_kb = source["output_kb"];
	        this.stack_mb = source["stack_mb"];
	        this.idle_timeout_ms = source["idle_timeout_ms"];
	    }
	}
	export class ProblemConfig {
	    id: string;
	    name: string;
	    version: number;
	    type: string;
	    tags?: string[];
	    languages: string[];
	    limits: ResourceLimits;
	    documents: DocumentsConfig;
	    evaluation: EvaluationConfig;
	    tests: TestsConfig;
	    interactive?: InteractiveConfig;
	
	    static createFrom(source: any = {}) {
	        return new ProblemConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.version = source["version"];
	        this.type = source["type"];
	        this.tags = source["tags"];
	        this.languages = source["languages"];
	        this.limits = this.convertValues(source["limits"], ResourceLimits);
	        this.documents = this.convertValues(source["documents"], DocumentsConfig);
	        this.evaluation = this.convertValues(source["evaluation"], EvaluationConfig);
	        this.tests = this.convertValues(source["tests"], TestsConfig);
	        this.interactive = this.convertValues(source["interactive"], InteractiveConfig);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ProblemSummary {
	    config: ProblemConfig;
	    root: string;
	    files: string[];
	
	    static createFrom(source: any = {}) {
	        return new ProblemSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.config = this.convertValues(source["config"], ProblemConfig);
	        this.root = source["root"];
	        this.files = source["files"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Project {
	    id: string;
	    name: string;
	    path: string;
	    version: number;
	    updatedAt: string;
	
	    static createFrom(source: any = {}) {
	        return new Project(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.path = source["path"];
	        this.version = source["version"];
	        this.updatedAt = source["updatedAt"];
	    }
	}
	
	

}

export namespace exporter {
	
	export class Request {
	    project_path: string;
	    destination: string;
	    target: string;
	
	    static createFrom(source: any = {}) {
	        return new Request(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.project_path = source["project_path"];
	        this.destination = source["destination"];
	        this.target = source["target"];
	    }
	}

}

export namespace generator {
	
	export class GeneratedCase {
	    index: number;
	    seed: number;
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new GeneratedCase(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.index = source["index"];
	        this.seed = source["seed"];
	        this.path = source["path"];
	    }
	}
	export class Request {
	    problem_root: string;
	    group_id: string;
	    command: string;
	    count: number;
	    seeds?: number[];
	    limits: domain.ResourceLimits;
	
	    static createFrom(source: any = {}) {
	        return new Request(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.problem_root = source["problem_root"];
	        this.group_id = source["group_id"];
	        this.command = source["command"];
	        this.count = source["count"];
	        this.seeds = source["seeds"];
	        this.limits = this.convertValues(source["limits"], domain.ResourceLimits);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Result {
	    cases: GeneratedCase[];
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new Result(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cases = this.convertValues(source["cases"], GeneratedCase);
	        this.error = source["error"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace judge {
	
	export class Request {
	    Command: string;
	    WorkDir: string;
	    Source: string;
	    Binary: string;
	    Input: string;
	    Output: string;
	    MainClass: string;
	    Limits: domain.ResourceLimits;
	
	    static createFrom(source: any = {}) {
	        return new Request(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Command = source["Command"];
	        this.WorkDir = source["WorkDir"];
	        this.Source = source["Source"];
	        this.Binary = source["Binary"];
	        this.Input = source["Input"];
	        this.Output = source["Output"];
	        this.MainClass = source["MainClass"];
	        this.Limits = this.convertValues(source["Limits"], domain.ResourceLimits);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Result {
	    verdict: string;
	    exit_code: number;
	    duration: number;
	    stdout: string;
	    stderr: string;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new Result(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.verdict = source["verdict"];
	        this.exit_code = source["exit_code"];
	        this.duration = source["duration"];
	        this.stdout = source["stdout"];
	        this.stderr = source["stderr"];
	        this.error = source["error"];
	    }
	}

}

