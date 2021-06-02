import React, {useRef, useState, useContext, useEffect} from 'react'
import './App.css'
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import {loadScript, codegen} from '../utils.js'
import { useCookies } from "react-cookie";
import db, {DBContext} from '../db/db_spec'
import Header from './Header'



export default function EditorView(props) {
    const editorRef = useRef(null);

    const [script, setScript] = useState("")
    const [title, setTitle] = useState("")

    const db_ref = useContext(DBContext)

    const iframeRef = useRef(null)

    console.log(props.match.params.id)

    const sketch_id = parseInt(props.match.params.id)

    const handleEditorDidMount = (editor, monaco) => {
      editorRef.current = editor; 
        db_ref.sketches.get(sketch_id).then(record => {
            setScript(record.source)
            setTitle(record.name)
            editor.value = record.source
        })
    }
    const handleEditorChange = (value, event) => {
        setScript(value);
        db.sketches.update(sketch_id, {source: value}).then(function (updated) {
            if(updated){console.log ("Source updated.")};
        });
        //setCookie("script", value, { path: '/' });
    }
    const saveFile = () => {
        console.log("fhfhahsh")
        let file = new Blob([script], {type: "text/plain"});
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.download = title + ".js";
        a.href = URL.createObjectURL(file);
        a.click();
    }

    const reloadHandler = () => {
        iframeRef.current.contentWindow.location.reload()
    }

    useEffect(() => {
        db_ref.sketches.get(sketch_id).then(record => {
            setScript(record.source)
        })
        return () => {
        }
    }, [])
    return (
        <>
            <Header sketchTitle={title} 
                    exportHandler={saveFile} titleHandler={(e) => setTitle(e)} 
                    reloadHandler={reloadHandler} 
                    refreshFn={props.refreshFn}
                    sketch_id={sketch_id}
                    isEditor={true}></Header>
            <div className="app-container">
                <Editor
                height="90vh"
                width="50vw"
                theme="vs-dark"
                options={{minimap:false}}
                defaultLanguage="javascript"
                value={script}
                className="editor"
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
                />
                <div className="frame-section">
                    <iframe ref={iframeRef} className="pframe" frameBorder="0" marginWidth="0" marginHeight="0" srcDoc={codegen(script)}></iframe>
                </div>
            </div>
        </>
    )
}
