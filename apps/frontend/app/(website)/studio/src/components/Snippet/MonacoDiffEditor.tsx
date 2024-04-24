import { DiffEditor, type DiffEditorProps } from "@monaco-editor/react";
import type { monaco } from "@studio/customMonaco";
import { useTheme } from "@studio/main/themeContext";
import type { VisibilityOptions } from "@studio/types/options";
import { useRef, useState } from "react";
import { type EditorProps, useEditor } from "./hook";

type CustomProps = {
  id?: string;
  placeholder?: string;
  originalEditorProps: EditorProps;
  modifiedEditorProps: EditorProps;
  leftPaneVisibilityOptions?: VisibilityOptions;
  renderSideBySide: boolean;
};

const defaultOptions = {
  wordWrap: "on",
  wrappingIndent: "indent",
  minimap: {
    enabled: false,
  },
  renderOverviewRuler: false,
  diffOverviewRuler: false,
  fixedOverflowWidgets: true,
  // removes scroll after last line
  scrollBeyondLastLine: false,
} as const;

const MonacoDiffEditor = ({
  originalEditorProps,
  modifiedEditorProps,
  options,
  ...restProps
}: DiffEditorProps & CustomProps) => {
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef<monaco.editor.IStandaloneDiffEditor>();
  const originalEditor = editorRef.current?.getOriginalEditor() ?? null;
  const modifiedEditor = editorRef.current?.getModifiedEditor() ?? null;

  const { isDark } = useTheme();

  useEditor(originalEditor, originalEditorProps, mounted);
  useEditor(modifiedEditor, modifiedEditorProps, mounted);

  return (
    <DiffEditor
      onMount={(editor) => {
        editorRef.current = editor;
        setMounted(true);
      }}
      theme={isDark ? "vs-dark" : "vs"}
      options={{
        ...(options ?? {}),
        ...defaultOptions,
        enableSplitViewResizing: false,
      }}
      {...restProps}
    />
  );
};

export default MonacoDiffEditor;
