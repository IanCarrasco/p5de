import React, {useRef, useState} from 'react'
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import './App.css'
import {loadScript, codegen} from './utils.js'
import { useCookies } from "react-cookie";

export default function App() {
    const editorRef = useRef(null);
    const [script, setScript] = useState("")
    const [cookies, setCookie, removeCookie] = useCookies("");


    const handleEditorDidMount = (editor, monaco) => {
      editorRef.current = editor; 
    }
    const handleEditorChange = (value, event) => {
        setScript(value);
        setCookie("script", value, { path: '/' });
    }

    return (
        <>
        <div className="header-bar">
            <h1>p5 ide</h1>
        </div>
        <div className="app-container">
            <Editor
            height="90vh"
            width="48vw"
            theme="vs-dark"
            options={{minimap:false}}
            defaultLanguage="javascript"
            defaultValue={cookies.script}
            className="editor"
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
            />
            <div className="frame-section">
                <iframe className="pframe" frameborder="0" marginwidth="0" marginheight="0" srcDoc={codegen(cookies.script)}></iframe>
            </div>
        </div>
        </>
    )
}
