import React, {useRef, useState, useContext, useEffect} from 'react'
import './App.css'
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import {loadScript, codegen} from '../utils.js'
import { useCookies } from "react-cookie";
import db, {DBContext} from '../db/db_spec'
import Header from './Header'
import SplitPane from 'react-split-pane'



export default function EditorView(props) {
    const editorRef = useRef(null);

    const [script, setScript] = useState("")
    const [title, setTitle] = useState("")
    const [codeWidth, setCodeWidth] = useState("50vw");
    const [previewWidth, setPreviewWidth] = useState("50vw");

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
    const expandHandler = ({panel}) => {
        switch (panel){
            case "code":
                if(codeWidth == "50vw"){
                    setCodeWidth("100vw")
                    setPreviewWidth("0vw");
                } else{
                    setCodeWidth("50vw")
                    setPreviewWidth("50vw");
                }
                break;
            case "preview":
                if(previewWidth == "50vw"){
                    setPreviewWidth("100vw")
                    setCodeWidth("0vw");
                } else{
                    setCodeWidth("50vw")
                    setPreviewWidth("50vw");
                }
                break;
        }
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
            <div className="options-pane">
                <button onClick={() => expandHandler({panel:"code"})} className="button-action panel-option">Expand Code</button>
                <button onClick={() => expandHandler({panel:"preview"})} className="button-action panel-option">Expand Preview</button>
            </div>
            <div className="app-container">

                    <Editor
                    height="90vh"
                    width={codeWidth}
                    theme="vs-dark"
                    options={{minimap:false}}
                    defaultLanguage="javascript"
                    value={script}
                    className="editor"
                    onMount={handleEditorDidMount}
                    onChange={handleEditorChange}
                    />
                    <div className="frame-section" style={{width:previewWidth}}>
                        <iframe ref={iframeRef} className="pframe" frameBorder="0" marginWidth="0" marginHeight="0" srcDoc={codegen(script)}></iframe>
                    </div>
            </div>
        </>
    )
}
