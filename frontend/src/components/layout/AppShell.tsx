import React from "react";
import {
  Bell,
  BookOpen,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Database,
  FileCode2,
  FolderOpen,
  Grid2X2,
  MoreHorizontal,
  Plus,
  Settings,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Project } from "@/services/projectService";
import "./layout.css";

const workspaceItems = [
  { label: "工作台", icon: Grid2X2 },
  { label: "题目编辑器", icon: FileCode2, count: 3 },
  { label: "测试数据", icon: Database },
];
type AppShellProps = {
  active: string;
  projectOpen: boolean;
  currentProject: Project | null;
  onNavigate: (label: string) => void;
  onNewProject: () => void;
  onOpenProject: () => void;
  onOpenRecent: (project: Project) => void;
  recentProjects: Project[];
  children: React.ReactNode;
};

export function AppShell({
  active,
  projectOpen,
  currentProject,
  onNavigate,
  onNewProject,
  onOpenProject,
  onOpenRecent,
  recentProjects,
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">S</span>
          <span className="brand-name">Shammaru</span>
          <Separator orientation="vertical" className="brand-separator" />
          <span className="brand-context">{projectOpen ? currentProject?.name ?? "题目工坊" : "题目工坊"}</span>
        </div>
        <div className="topbar-actions">
          <Button size="icon" variant="ghost" aria-label="切换主题">
            <Sun size={16} />
          </Button>
          <Button
            className="notification"
            size="icon"
            variant="ghost"
            aria-label="通知"
          >
            <Bell size={16} />
            <i />
          </Button>
          <Separator orientation="vertical" className="topbar-separator" />
          <button className="profile">
            <span className="avatar">YL</span>
            <span>Yuki Lin</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </header>
      <div className="app-body">
        <aside
          className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${!projectOpen ? "sidebar-projects" : ""}`}
        >
          <div className="sidebar-content">
            {projectOpen ? (
              <>
                <Button
                  className="new-project"
                  onClick={() => onNavigate("题目编辑器")}
                >
                  <Plus size={16} />
                  <span>新建题目</span>
                  <kbd>⌘ N</kbd>
                </Button>
                <nav>
                  <p className="nav-label">工作区</p>
                  {workspaceItems.map(({ label, icon: Icon, count }) => (
                    <button
                      key={label}
                      onClick={() => onNavigate(label)}
                      className={`nav-item ${active === label ? "active" : ""}`}
                      title={collapsed ? label : undefined}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                      {count && <em>{count}</em>}
                    </button>
                  ))}
                  <p className="nav-label nav-spaced">资源</p>
                  <button
                    className={`nav-item ${active === "文档" ? "active" : ""}`}
                    onClick={() => onNavigate("文档")}
                  >
                    <BookOpen size={16} />
                    <span>文档</span>
                    <ChevronRight className="nav-chevron" size={14} />
                  </button>
                </nav>
              </>
            ) : (
              <>
                <Button className="new-project" onClick={onNewProject}>
                  <Plus size={16} />
                  <span>新建项目</span>
                  <kbd>⌘ N</kbd>
                </Button>
                <nav>
                  <p className="nav-label">项目</p>
                  <button className="nav-item" onClick={onOpenProject}>
                    <FolderOpen size={16} />
                    <span>打开项目</span>
                  </button>
                  <p className="nav-label nav-spaced">最近项目</p>
                  {recentProjects.map((project) => (
                    <button
                      className="nav-item recent-project"
                      key={project.id}
                      onClick={() => onOpenRecent(project)}
                      title={collapsed ? project.name : undefined}
                    >
                      <span className="project-dot" />
                      <span>{project.name}</span>
                    </button>
                  ))}
                </nav>
              </>
            )}
          </div>
          <div className="sidebar-bottom">
            <button className="nav-item">
              <Settings size={16} />
              <span>设置</span>
            </button>
            <div className="user-card">
              <span className="avatar">YL</span>
              <div>
                <strong>Yuki Lin</strong>
                <small>个人工作区</small>
              </div>
              <MoreHorizontal size={16} />
            </div>
          </div>
          <Button
            className="collapse-trigger"
            size="icon"
            variant="outline"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            {collapsed ? (
              <ChevronsRight size={14} />
            ) : (
              <ChevronsLeft size={14} />
            )}
          </Button>
        </aside>
        <main className="main-area">{children}</main>
      </div>
    </div>
  );
}
