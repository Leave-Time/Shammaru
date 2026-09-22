import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { WelcomePage } from "@/components/welcome/WelcomePage";
import { useProjectSession } from "@/hooks/useProjectSession";
import { useWorkspaceNavigation } from "@/hooks/useWorkspaceNavigation";
import { SettingsPage } from "@/components/settings/SettingsPage";
import {
  DocumentPage,
  ExportPage,
  ProblemInfoPage,
  ProblemsPage,
  ProjectSettingsPage,
  SolutionsPage,
  TestDataPage,
} from "@/components/workbench/WorkbenchPages";

const problems = [
  { id: "P1001", name: "区间最大子段和" },
  { id: "P1002", name: "迷宫探险家" },
  { id: "P1003", name: "多项式乘法" },
];

export default function App() {
  const { active, navigate } = useWorkspaceNavigation();
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null,
  );
  const {
    recentProjects,
    currentProject,
    isProjectOpen,
    newProject,
    openProject,
    openRecent,
  } = useProjectSession();
  return (
    <AppShell
      active={active}
      projectOpen={isProjectOpen}
      currentProject={currentProject}
      problems={problems}
      selectedProblemId={selectedProblemId}
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
      onSelectProject={(project) => {
        void openRecent(project);
        setSelectedProblemId(null);
        navigate("首页");
      }}
      onSelectProblem={(problemId) => {
        setSelectedProblemId(problemId);
        navigate("题目信息");
      }}
      onBackToProblems={() => {
        setSelectedProblemId(null);
        navigate("题目");
      }}
    >
      {active === "设置" ? <SettingsPage /> : isProjectOpen ? (
        renderProjectPage(active, navigate, setSelectedProblemId)
      ) : (
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

function renderProjectPage(
  active: string,
  navigate: (label: string) => void,
  selectProblem: (problemId: string) => void,
) {
  switch (active) {
    case "项目设置":
      return <ProjectSettingsPage />;
    case "题目信息":
      return <ProblemInfoPage />;
    case "文档编辑":
      return <DocumentPage />;
    case "测试数据与样例":
      return <TestDataPage />;
    case "标程与裁判解":
      return <SolutionsPage />;
    case "导出":
      return <ExportPage />;
    case "题目":
      return (
        <ProblemsPage
          onSelect={() => navigate("题目信息")}
          onSelectProblem={(problemId) => {
            selectProblem(problemId);
            navigate("题目信息");
          }}
        />
      );
    default:
      return (
        <DashboardPage
          onNew={() => {
            selectProblem("P1001");
            navigate("题目信息");
          }}
        />
      );
  }
}
