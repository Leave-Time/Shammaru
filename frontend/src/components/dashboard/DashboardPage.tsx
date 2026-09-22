import { useState } from "react";
import {
  ChevronRight,
  Database,
  FileCode2,
  Lightbulb,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import "./dashboard.css";

const projects = [
  {
    name: "区间最大子段和",
    description: "线段树与动态规划的综合应用",
    language: "C++",
    status: "已发布",
    time: "更新于 2 小时前",
    level: "困难",
    levelClass: "hard",
    score: "4.8",
  },
  {
    name: "迷宫探险家",
    description: "图论搜索与最短路径问题",
    language: "Python",
    status: "草稿",
    time: "更新于 昨天",
    level: "中等",
    levelClass: "medium",
    score: "4.6",
  },
  {
    name: "多项式乘法",
    description: "快速傅里叶变换基础",
    language: "C++",
    status: "已发布",
    time: "更新于 3 天前",
    level: "困难",
    levelClass: "hard",
    score: "4.9",
  },
];
export function DashboardPage({ onNew }: { onNew: () => void }) {
  const [tab, setTab] = useState("最近项目");
  return (
    <>
      <div className="dashboard-scroll">
        <div className="dashboard-inner">
          <div className="breadcrumb">
              工作区 <ChevronRight size={13} /> <strong>首页</strong>
          </div>
          <section className="welcome">
            <div>
              <p className="eyebrow">2024 秋季赛 · 个人工作区</p>
              <h1>
                欢迎回来，Yuki <span>✦</span>
              </h1>
              <p>继续打磨你的下一道好题，或从模板快速开始。</p>
            </div>
            <Button onClick={onNew}>
              <Plus size={16} />
              新建题目
            </Button>
          </section>
          <div className="stats-grid">
            <Stat
              icon={<FileCode2 />}
              label="题目总数"
              value="24"
              change="+3"
              note="本月"
            />
            <Stat
              icon={<Database />}
              label="测试数据集"
              value="86"
              change="+12"
              note="本月"
            />
            <Stat
              icon={<Play />}
              label="通过率"
              value="92.4%"
              change="+4.8%"
              note="较上月"
              positive
            />
          </div>
          <div className="project-toolbar">
            <div>
              {["最近项目", "我的收藏"].map((item) => (
                <button
                  key={item}
                  className={tab === item ? "selected" : ""}
                  onClick={() => setTab(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm">
              <Search size={15} />
              搜索项目
            </Button>
          </div>
          <section className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
            <button className="create-card" onClick={onNew}>
              <span>
                <Plus size={20} />
              </span>
              <strong>创建新题目</strong>
              <small>从空白题目开始</small>
            </button>
          </section>
          <Card className="inspiration">
            <span className="inspiration-icon">
              <Sparkles size={19} />
            </span>
            <div>
              <strong>需要一点灵感？</strong>
              <p>浏览题目模板库，快速开启你的出题流程。</p>
            </div>
            <Button variant="outline" size="sm">
              浏览模板 <ChevronRight size={14} />
            </Button>
          </Card>
        </div>
      </div>
      <footer className="dashboard-footer">
        <span>
          <i />
          所有更改已保存
        </span>
        <span>Shammaru v0.1.0</span>
      </footer>
    </>
  );
}
function Stat({
  icon,
  label,
  value,
  change,
  note,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  note: string;
  positive?: boolean;
}) {
  return (
    <Card className="stat">
      <span className="stat-icon">{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
      <em className={positive ? "positive" : ""}>
        {change} <i>{note}</i>
      </em>
    </Card>
  );
}
function ProjectCard({
  name,
  description,
  language,
  status,
  time,
  level,
  levelClass,
  score,
}: (typeof projects)[number]) {
  return (
    <Card className="project-card">
      <div className="project-top">
        <Badge
          variant="secondary"
          className={language === "Python" ? "python" : "cpp"}
        >
          {language}
        </Badge>
        <Button variant="ghost" size="icon">
          <MoreHorizontal size={16} />
        </Button>
      </div>
      <div className="project-main">
        <h3>{name}</h3>
        <p>{description}</p>
        <div className="project-meta">
          <span>
            <i className={status === "草稿" ? "amber" : ""} />
            {status}
          </span>
          <span>{time}</span>
        </div>
      </div>
      <Separator />
      <div className="project-bottom">
        <span className={levelClass}>{level}</span>
        <span>
          <Star size={12} />
          {score}
        </span>
      </div>
    </Card>
  );
}
