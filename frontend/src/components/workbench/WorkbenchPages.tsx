import {
  Check,
  ChevronRight,
  Code2,
  Download,
  FileText,
  FolderOpen,
  Plus,
  Save,
  Settings2,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import "./workbench.css";
import "./problem.css";
import { CodeEditor } from "./CodeEditor";

export function ProjectSettingsPage() {
  return (
    <WorkbenchFrame
      eyebrow="项目设置"
      title="项目设置"
      description="管理项目基础信息与默认配置。"
    >
      <Card className="workbench-panel settings-panel">
        <div className="panel-heading">
          <div>
            <h2>基本信息</h2>
            <p>这些信息会用于项目首页和导出文件。</p>
          </div>
          <Button>
            <Save size={15} />
            保存更改
          </Button>
        </div>
        <Separator />
        <label className="field">
          <span>项目名称</span>
          <Input defaultValue="2024 秋季赛题目集" />
        </label>
        <label className="field">
          <span>项目标识</span>
          <Input defaultValue="autumn-2024" />
        </label>
        <label className="field">
          <span>项目描述</span>
          <textarea defaultValue="面向校内竞赛的算法题目集合。" />
        </label>
      </Card>
      <Card className="workbench-panel">
        <div className="panel-heading">
          <div>
            <h2>默认设置</h2>
            <p>为新建题目预设语言和评测规则。</p>
          </div>
        </div>
        <Separator />
        <div className="setting-row">
          <div>
            <strong>默认编程语言</strong>
            <small>新题目会继承这个选择</small>
          </div>
          <Badge variant="secondary">
            C++17 <ChevronRight size={13} />
          </Badge>
        </div>
        <div className="setting-row">
          <div>
            <strong>评测模式</strong>
            <small>使用标准输入输出进行评测</small>
          </div>
          <Badge variant="secondary">标准评测</Badge>
        </div>
      </Card>
    </WorkbenchFrame>
  );
}

export function ProblemsPage({
  onSelect,
  onSelectProblem,
}: {
  onSelect: (label: string) => void;
  onSelectProblem?: (problemId: string) => void;
}) {
  const problems = [
    ["区间最大子段和", "P1001", "已发布", "困难"],
    ["迷宫探险家", "P1002", "草稿", "中等"],
    ["多项式乘法", "P1003", "已发布", "困难"],
  ];
  return (
    <WorkbenchFrame
      eyebrow="题目"
      title="题目"
      description="管理项目中的全部题目，进入题目后继续编辑。"
    >
      <Card className="workbench-panel problem-list-panel">
        <div className="panel-heading">
          <div>
            <h2>全部题目</h2>
            <p>{problems.length} 道题目 · 最近更新</p>
          </div>
          <Button onClick={() => onSelect("题目信息")}>
            <Plus size={15} />
            新建题目
          </Button>
        </div>
        <Separator />
        <div className="problem-list">
          {problems.map(([name, id, status, level]) => (
            <button
              className="problem-row"
              key={id}
              onClick={() => onSelectProblem?.(id)}
            >
              <span className="problem-index">{id}</span>
              <span className="problem-name">
                <strong>{name}</strong>
                <small>更新于今天 · C++17</small>
              </span>
              <Badge
                variant="secondary"
                className={
                  status === "草稿" ? "draft-badge" : "published-badge"
                }
              >
                {status}
              </Badge>
              <span
                className={`problem-level ${level === "困难" ? "hard" : "medium"}`}
              >
                {level}
              </span>
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      </Card>
    </WorkbenchFrame>
  );
}

export function ProblemInfoPage() {
  return (
    <WorkbenchFrame
      eyebrow="题目 / 题目信息"
      title="区间最大子段和"
      description="完善题目的基本信息，建立清晰的出题上下文。"
    >
      <Card className="workbench-panel">
        <div className="panel-heading">
          <div>
            <h2>题目概览</h2>
            <p>题目名称、难度和标签。</p>
          </div>
          <Button>
            <Save size={15} />
            保存
          </Button>
        </div>
        <Separator />
        <div className="form-grid">
          <label className="field">
            <span>题目名称</span>
            <Input defaultValue="区间最大子段和" />
          </label>
          <label className="field">
            <span>难度</span>
            <Input defaultValue="困难" />
          </label>
          <label className="field">
            <span>题目编号</span>
            <Input defaultValue="P1001" />
          </label>
          <label className="field">
            <span>时间限制</span>
            <Input defaultValue="1000 ms" />
          </label>
        </div>
        <label className="field">
          <span>题目简介</span>
          <textarea defaultValue="给定一个整数序列，求所有连续子段中的最大和。" />
        </label>
      </Card>
      <Card className="workbench-panel">
        <div className="panel-heading">
          <div>
            <h2>标签</h2>
            <p>使用标签帮助团队快速定位题目。</p>
          </div>
          <Button variant="outline">
            <Plus size={15} />
            添加标签
          </Button>
        </div>
        <div className="tag-list">
          <Badge>动态规划</Badge>
          <Badge>线段树</Badge>
          <Badge>序列</Badge>
        </div>
      </Card>
    </WorkbenchFrame>
  );
}

export function DocumentPage() {
  return (
    <WorkbenchFrame
      eyebrow="题目 / 文档编辑"
      title="文档编辑"
      description="专注编写题面内容，实时预览最终呈现效果。"
    >
      <div className="editor-layout">
        <CodeEditor
          fileName="statement.md"
          language="markdown"
          value={
            "# 区间最大子段和\n\n给定一个长度为 n 的整数序列，请你求出其中连续子段的最大和。\n\n## 输入格式\n第一行包含一个整数 n。\n第二行包含 n 个整数。\n\n## 输出格式\n输出一个整数，表示连续子段的最大和。"
          }
        />
        <Card className="workbench-panel preview-panel">
          <div className="panel-heading">
            <div>
              <h2>预览</h2>
              <p>题面在评测平台中的显示效果。</p>
            </div>
            <Badge variant="secondary">Markdown</Badge>
          </div>
          <Separator />
          <div className="markdown-preview">
            <h1>区间最大子段和</h1>
            <p>给定一个长度为 n 的整数序列，请你求出其中连续子段的最大和。</p>
            <h2>输入格式</h2>
            <p>第一行包含一个整数 n。</p>
            <p>第二行包含 n 个整数。</p>
            <h2>输出格式</h2>
            <p>输出一个整数，表示连续子段的最大和。</p>
          </div>
        </Card>
      </div>
    </WorkbenchFrame>
  );
}

export function TestDataPage() {
  return (
    <WorkbenchFrame
      eyebrow="题目 / 测试数据与样例"
      title="测试数据与样例"
      description="组织样例和测试点，确认题目的覆盖范围。"
    >
      <Card className="workbench-panel">
        <div className="panel-heading">
          <div>
            <h2>样例</h2>
            <p>展示给答题者的输入与输出。</p>
          </div>
          <Button>
            <Plus size={15} />
            添加样例
          </Button>
        </div>
        <Separator />
        <div className="sample-grid">
          <Sample title="样例 1" input="5\n-2 1 -3 4 -1" output="4" />
          <Sample title="样例 2" input="3\n-1 -2 -3" output="-1" />
        </div>
      </Card>
      <Card className="workbench-panel">
        <div className="panel-heading">
          <div>
            <h2>测试点</h2>
            <p>共 12 个测试点，覆盖边界与大规模数据。</p>
          </div>
          <Button variant="outline">
            <Upload size={15} />
            导入数据
          </Button>
        </div>
        <Separator />
        <div className="data-status">
          <span className="status-dot" />
          <strong>数据集完整</strong>
          <span>12 / 12 个测试点已配置</span>
          <Button variant="ghost" size="sm">
            管理测试点 <ChevronRight size={14} />
          </Button>
        </div>
      </Card>
    </WorkbenchFrame>
  );
}

export function SolutionsPage() {
  return (
    <WorkbenchFrame
      eyebrow="题目 / 标程与裁判解"
      title="标程与裁判解"
      description="维护可信的参考实现，并验证评测逻辑。"
    >
      <CodeEditor
        fileName="main.cpp"
        language="cpp"
        value={`#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  ios::sync_with_stdio(false);\n  cin.tie(nullptr);\n  int n; cin >> n;\n  long long best = LLONG_MIN, sum = 0, x;\n  while (n--) { cin >> x; sum = max(x, sum + x); best = max(best, sum); }\n  cout << best << '\\n';\n}`}
      />
      <Card className="workbench-panel">
        <div className="setting-row">
          <div>
            <strong>最近一次验证</strong>
            <small>所有测试点均通过 · 2.4 秒前</small>
          </div>
          <span className="success-label">
            <Check size={14} />
            验证通过
          </span>
        </div>
      </Card>
    </WorkbenchFrame>
  );
}

export function ExportPage() {
  return (
    <WorkbenchFrame
      eyebrow="导出"
      title="导出项目"
      description="选择格式，将题目和资源打包交付。"
    >
      <Card className="workbench-panel export-panel">
        <div className="export-option selected">
          <span className="export-icon">
            <FolderOpen size={18} />
          </span>
          <div>
            <strong>竞赛题包</strong>
            <small>题面、样例、测试数据和标程</small>
          </div>
          <Check size={17} />
        </div>
        <div className="export-option">
          <span className="export-icon">
            <FileText size={18} />
          </span>
          <div>
            <strong>题面文档</strong>
            <small>仅导出 Markdown 题面与样例</small>
          </div>
        </div>
        <div className="export-option">
          <span className="export-icon">
            <Settings2 size={18} />
          </span>
          <div>
            <strong>评测资源</strong>
            <small>仅导出测试数据和裁判解</small>
          </div>
        </div>
        <Separator />
        <div className="export-footer">
          <span>预计大小 2.4 MB</span>
          <Button>
            <Download size={15} />
            导出 ZIP
          </Button>
        </div>
      </Card>
    </WorkbenchFrame>
  );
}

function Sample({
  title,
  input,
  output,
}: {
  title: string;
  input: string;
  output: string;
}) {
  return (
    <div className="sample">
      <strong>{title}</strong>
      <div>
        <small>输入</small>
        <pre>{input}</pre>
      </div>
      <div>
        <small>输出</small>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

function WorkbenchFrame({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="workbench-scroll">
      <div className="workbench-inner">
        <div className="breadcrumb">
          工作区 <ChevronRight size={13} /> <strong>{eyebrow}</strong>
        </div>
        <header className="workbench-heading">
          <div>
            <p className="eyebrow">题目工坊 · 项目空间</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </header>
        <div className="workbench-content">{children}</div>
      </div>
    </div>
  );
}
