import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { WelcomePage } from "@/components/welcome/WelcomePage";
import { useProjectSession } from "@/hooks/useProjectSession";
import { useWorkspaceNavigation } from "@/hooks/useWorkspaceNavigation";
import {
  DocumentPage,
  ExportPage,
  ProblemInfoPage,
  ProblemsPage,
  ProjectSettingsPage,
  SolutionsPage,
  TestDataPage,
} from "@/components/workbench/WorkbenchPages";

export default function App() {
  const { active, navigate } = useWorkspaceNavigation();
  const { recentProjects, currentProject, isProjectOpen, newProject, openProject, openRecent } =
    useProjectSession();
  return (
    <AppShell
      active={active}
      projectOpen={isProjectOpen}
      currentProject={currentProject}
      recentProjects={recentProjects}
      onNavigate={navigate}
      onNewProject={() => {
        void newProject();
      }}
      onOpenProject={() => {
        void openProject();
      }}
      onOpenRecent={(project) => {
        void openRecent(project);
      }}
    >
      {isProjectOpen ? renderProjectPage(active, navigate) : (
        <WelcomePage
          recentProjects={recentProjects}
          onNewProject={() => {
            void newProject();
          }}
          onOpenProject={() => {
            void openProject();
          }}
        />
      )}
    </AppShell>
  );
}

function renderProjectPage(active: string, navigate: (label: string) => void) {
  switch (active) {
    case "项目设置": return <ProjectSettingsPage />;
    case "题目信息": return <ProblemInfoPage />;
    case "文档编辑": return <DocumentPage />;
    case "测试数据与样例": return <TestDataPage />;
    case "标程与裁判解": return <SolutionsPage />;
    case "导出": return <ExportPage />;
    case "题目": return <ProblemsPage onSelect={navigate} />;
    default: return <DashboardPage onNew={() => navigate("题目信息")} />;
  }
}
