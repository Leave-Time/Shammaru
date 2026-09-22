import { CreateProject, GetRecentProjects, OpenProjectDialog, OpenRecentProject } from '../../wailsjs/go/app/App'

export type Project = { id: string; name: string; path: string; updatedAt: string }

export const fallbackProjects: Project[] = [
  { id: 'demo-autumn', name: '2024 秋季赛题目集', path: 'local://2024-autumn', updatedAt: new Date().toISOString() },
  { id: 'demo-algorithms', name: '算法基础训练', path: 'local://algorithm-training', updatedAt: new Date().toISOString() },
  { id: 'demo-school', name: '校赛选拔赛', path: 'local://school-contest', updatedAt: new Date().toISOString() },
]

function hasWailsBridge() { return typeof window !== 'undefined' && Boolean((window as Window & { go?: unknown }).go) }

export async function listRecentProjects(): Promise<Project[]> {
  if (!hasWailsBridge()) return fallbackProjects
  return GetRecentProjects()
}

export async function createProject(name = '未命名项目'): Promise<Project> {
  if (!hasWailsBridge()) return { id: `local-${Date.now()}`, name, path: `local://${name}`, updatedAt: new Date().toISOString() }
  return CreateProject(name)
}

export async function openProjectDialog(): Promise<Project | null> {
  if (!hasWailsBridge()) return fallbackProjects[0]
  try { return await OpenProjectDialog() } catch (error) { if (String(error).toLowerCase().includes('cancel')) return null; throw error }
}

export async function openRecentProject(project: Project): Promise<Project> {
  if (!hasWailsBridge() || project.path.startsWith('local://')) return { ...project, updatedAt: new Date().toISOString() }
  return OpenRecentProject(project.path)
}
