'use client';
import { Editor } from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import { emmetHTML } from "emmet-monaco-es";
import { useEffect, useRef, useState } from "react";

const defaultValue = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello world</title>
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
    <style>
        * { margin: 0; }

        body {
            background-color: #1e2939;
            color: white;
            font-family: 'Inter', Arial, sans-serif;
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    <h1>Hello world</h1>
    <span>Edit me!</span>
</body>
</html>`;

export default function Home() {
    const emmetRef = useRef<(() => void) | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [editorText, setEditorText] = useState(defaultValue);

    const handleEditorWillMount = (monaco: Monaco) => {
        emmetRef.current = emmetHTML(monaco);

        monaco.editor.defineTheme('htmlbox-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'C084FC' },
                { token: 'string', foreground: '34D399' },
                { token: 'number', foreground: 'F59E0B' },
                { token: 'tag', foreground: '60A5FA' },
                { token: 'attribute.name', foreground: 'A78BFA' },
                { token: 'attribute.value', foreground: '34D399' },
                { token: 'delimiter', foreground: '9CA3AF' },
            ],
            colors: {
                'editor.background': '#111827',
                'editor.foreground': '#E5E7EB',
                'editor.lineHighlightBackground': '#1F2937',
                'editorLineNumber.foreground': '#6B7280',
                'editorLineNumber.activeForeground': '#9CA3AF',
                'editor.selectionBackground': '#374151',
                'editor.inactiveSelectionBackground': '#1F2937',
                'editorCursor.foreground': '#60A5FA',
                'editorWhitespace.foreground': '#374151',
            }
        });
    };

    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.srcdoc = editorText;
        }
    }, [editorText]);

    useEffect(() => {
        return () => {
            if (emmetRef.current) {
                emmetRef.current();
            }
        }
    }, []);

    return (
        <div className="flex flex-col text-white font-sans bg-gray-900 w-full h-screen">
            <div className="bg-gray-800 pt-4 pb-4">
                <span className="ml-4 font-bold text-xl">HTMLBox</span>
            </div>
            <div className="flex-1 flex flex-row">
                <div className="w-[50%] h-full">
                    <Editor 
                        theme="htmlbox-dark"
                        language="html"
                        beforeMount={handleEditorWillMount}
                        value={editorText}
                        onChange={(e) => setEditorText(e!)}
                    />
                </div>

                <div className="w-[50%] h-full">
                    <iframe ref={iframeRef} className="border-0 w-full h-full bg-white"></iframe>
                </div>
            </div>
            <div className="bg-gray-800 pt-4 pb-4 flex justify-center items-center">
                <span className="font-bold">made by dumo. {new Date().getFullYear()}</span>
            </div>
        </div>
    );
}
