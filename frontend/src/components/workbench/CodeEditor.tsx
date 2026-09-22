import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Check, Code2, FileCode2, Save, Search, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import "./code-editor.css";

type CodeEditorProps = {
  value: string;
  language: "markdown" | "cpp" | "python";
  fileName: string;
  onChange?: (value: string) => void;
};

export function CodeEditor({ value: initialValue, language, fileName, onChange }: CodeEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [saved, setSaved] = useState(true);
  return <section className="code-editor-shell">
    <div className="code-editor-header">
      <div className="code-editor-file"><FileCode2 size={15} /><strong>{fileName}</strong><span>{saved ? "已保存" : "未保存"}</span></div>
      <div className="code-editor-actions"><Badge variant="secondary"><Code2 size={13} />{language === "cpp" ? "C++17" : language === "python" ? "Python 3" : "Markdown"}</Badge><Button variant="ghost" size="icon" aria-label="搜索代码"><Search size={15} /></Button><Button variant="ghost" size="icon" aria-label="编辑器设置"><Settings2 size={15} /></Button><Button size="sm" onClick={() => setSaved(true)}><Save size={14} />保存</Button></div>
    </div>
    <div className="code-editor-body"><Editor height="500px" language={language} theme="vs" value={value} onChange={(next) => { const updated = next ?? ""; setValue(updated); setSaved(false); onChange?.(updated); }} options={{ automaticLayout: true, minimap: { enabled: true }, fontSize: 13, lineHeight: 22, padding: { top: 16, bottom: 16 }, scrollBeyondLastLine: false, wordWrap: language === "markdown" ? "on" : "off", tabSize: 2, insertSpaces: true, bracketPairColorization: { enabled: true }, renderWhitespace: "selection", suggest: { showMethods: true, showFunctions: true } }} /></div>
    <footer className="code-editor-footer"><span><i className="editor-status-dot" />{saved ? "所有更改已保存" : "有未保存的更改"}</span><span>行 {value.split("\n").length} · UTF-8</span></footer>
  </section>;
}
