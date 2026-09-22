import { useCallback, useEffect, useState } from "react";
import {
  createProject,
  listRecentProjects,
  openProjectDialog,
  openRecentProject,
  type Project,
} from "@/services/projectService";

export function useProjectSession() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listRecentProjects()
      .then((projects) => {
        if (!cancelled) setRecentProjects(projects);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const rememberAndOpen = useCallback((project: Project | null) => {
    if (!project) return null;
    setCurrentProject(project);
    setRecentProjects((projects) =>
      [project, ...projects.filter((item) => item.path !== project.path)].slice(
        0,
        12,
      ),
    );
    return project;
  }, []);
  const newProject = useCallback(
    async () => rememberAndOpen(await createProject()),
    [rememberAndOpen],
  );
  const openProject = useCallback(
    async () => rememberAndOpen(await openProjectDialog()),
    [rememberAndOpen],
  );
  const openRecent = useCallback(
    async (project: Project) =>
      rememberAndOpen(await openRecentProject(project)),
    [rememberAndOpen],
  );
  return {
    recentProjects,
    currentProject,
    isLoading,
    isProjectOpen: currentProject !== null,
    newProject,
    openProject,
    openRecent,
  };
}
