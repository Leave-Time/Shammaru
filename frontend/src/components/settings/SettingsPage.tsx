import { useEffect, useState } from 'react'
import { Check, Folder, RotateCcw, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { defaultSettings, getSettings, saveSettings, type Settings } from '@/services/settingsService'
import './settings.css'
export function SettingsPage() {
 const [settings,setSettings]=useState<Settings>(defaultSettings); const [status,setStatus]=useState('')
 useEffect(()=>{getSettings().then(setSettings)},[])
 const update=<K extends keyof Settings>(key:K,value:Settings[K])=>setSettings(current=>({...current,[key]:value}))
 async function save(){await saveSettings(settings);setStatus('已保存');window.setTimeout(()=>setStatus(''),2200)}
 return <div className="settings-scroll"><div className="settings-inner"><div className="settings-heading"><div><p className="eyebrow">偏好设置</p><h1>设置</h1><p>管理 Shammaru 的通用工作方式，这些配置会保存在本机。</p></div><div className="settings-actions"><Button variant="ghost" onClick={()=>{setSettings(defaultSettings);setStatus('已恢复默认值')}}><RotateCcw size={15}/>恢复默认</Button><Button onClick={()=>void save()}><Save size={15}/>保存设置</Button></div></div><Card className="settings-section"><div className="settings-section-title"><h2>外观</h2><p>调整应用界面的显示方式。</p></div><label className="settings-field"><span>主题</span><select value={settings.theme} onChange={e=>update('theme',e.target.value as Settings['theme'])}><option value="system">跟随系统</option><option value="light">浅色</option><option value="dark">深色</option></select></label></Card><Card className="settings-section"><div className="settings-section-title"><h2>工作区</h2><p>设置项目创建和编辑时的默认行为。</p></div><label className="settings-toggle"><span><strong>自动保存</strong><small>编辑题面和配置后自动保存更改</small></span><input type="checkbox" checked={settings.autoSave} onChange={e=>update('autoSave',e.target.checked)}/><i/></label><label className="settings-field"><span>默认项目目录</span><div className="settings-input"><Folder size={15}/><input value={settings.defaultProjectDir} placeholder="使用系统默认目录" onChange={e=>update('defaultProjectDir',e.target.value)}/></div></label><label className="settings-field"><span>编辑器字号</span><div className="number-input"><input type="number" min="10" max="24" value={settings.editorFontSize} onChange={e=>update('editorFontSize',Number(e.target.value))}/><span>px</span></div></label></Card><div className={`settings-status ${status?'visible':''}`}><Check size={14}/>{status||' '}</div></div></div>
}
