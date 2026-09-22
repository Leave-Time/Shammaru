import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { WelcomePage } from "@/components/welcome/WelcomePage";
import { useProjectSession } from "@/hooks/useProjectSession";
import { useWorkspaceNavigation } from "@/hooks/useWorkspaceNavigation";
import { SettingsPage } from "@/components/settings/SettingsPage";

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
      {active === "设置" ? <SettingsPage /> : isProjectOpen ? (
        <DashboardPage onNew={() => navigate("题目编辑器")} />
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
