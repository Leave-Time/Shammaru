import { ArrowRight, Clock3, FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/services/projectService";
import "./welcome.css";

export function WelcomePage({
  onNewProject,
  onOpenProject,
  recentProjects,
}: {
  onNewProject: () => void;
  onOpenProject: (name?: string) => void;
  recentProjects: Project[];
}) {
  return (
    <div className="welcome-page">
      <div className="welcome-center">
        <div className="welcome-logo">S</div>
        <h1>欢迎使用 Shammaru</h1>
        <p className="welcome-subtitle">还没想好这里写什么</p>
        <div className="welcome-actions">
          <Button onClick={onNewProject}>
            <Plus size={17} />
            新建项目
          </Button>
          <Button variant="outline" onClick={() => onOpenProject()}>
            <FolderOpen size={17} />
            打开项目
          </Button>
        </div>
        <div className="recent-heading">
          <span>最近项目</span>
          <button onClick={() => onOpenProject()}>
            查看全部 <ArrowRight size={13} />
          </button>
        </div>
        <div className="welcome-recent">
          {recentProjects.map((project) => (
            <button
              key={project.name}
              onClick={() => onOpenProject(project.name)}
            >
              <span className="recent-folder">
                <FolderOpen size={16} />
              </span>
              <span className="recent-copy">
                <strong>{project.name}</strong>
                <small>{project.path.startsWith("local://") ? "本地演示项目" : "最近打开"}</small>
              </span>
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
        <p className="welcome-hint">
          <Clock3 size={13} /> 项目会保存在你的本地工作区
        </p>
      </div>
      <div className="welcome-shortcuts">
        <span>⌘ N 新建项目</span>
        <span>⌘ O 打开项目</span>
      </div>
    </div>
  );
}
