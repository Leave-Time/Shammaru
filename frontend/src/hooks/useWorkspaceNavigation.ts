import { useState } from 'react'

export function useWorkspaceNavigation() {
  const [active, setActive] = useState('首页')
  return { active, navigate: setActive }
}
