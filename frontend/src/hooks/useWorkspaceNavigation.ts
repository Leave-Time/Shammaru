import { useState } from 'react'

export function useWorkspaceNavigation() {
  const [active, setActive] = useState('工作台')
  return { active, navigate: setActive }
}
