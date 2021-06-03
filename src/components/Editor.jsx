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
    const [iscript, setIScript] = useState("")

    const [title, setTitle] = useState("")
    const [codeWidth, setCodeWidth] = useState("50vw");
    const [codeBtnText, setCodeBtnText] = useState("Expand Code")
    const [editBtnText, setEditBtnText] = useState("Open Settings")
    const [previewBtnText, setPreviewBtnText] = useState("Expand Preview")
    const [previewWidth, setPreviewWidth] = useState("50vw");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [settings, setSettings] = useState("{}");


    const db_ref = useContext(DBContext)

    const iframeRef = useRef(null)

    const sketch_id = parseInt(props.match.params.id)

    const handleEditorDidMount = (editor, monaco) => {
      editorRef.current = editor; 
        db_ref.sketches.get(sketch_id).then(record => {
            setScript(record.source)
            setIScript(record.source)
            setTitle(record.name)
            editor.value = record.source
        })
    }
    const handleEditorChange = (value, event) => {
        setScript(value);
        if(isLive){
            setIScript(value);
        }
        db.sketches.update(sketch_id, {source: value}).then(function (updated) {
            if(updated){console.log ("Source updated.")};
        });

        //setCookie("script", value, { path: '/' });
    }
    const handleSettingsEditorDidMount = (editor, monaco) => {
        editorRef.current = editor; 
        db_ref.settings.get(1).then(record => {
            setSettings(record.config)
            editor.value = record.config
        })
      }
    const handleSettingsEditorChange = (value, event) => {
          setSettings(value);
          db.settings.update(1, {config: value}).then(function (updated) {
              if(updated){console.log ("Settings updated.")};
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
        setIScript(script)
    }
    const expandHandler = ({panel}) => {
        switch (panel){
            case "code":
                if(codeWidth == "50vw"){
                    setCodeWidth("100vw")
                    setPreviewWidth("0vw");
                    setCodeBtnText("Collapse Code")
                } else{
                    setCodeWidth("50vw")
                    setPreviewWidth("50vw");
                    setCodeBtnText("Expand Code")
                }
                break;
            case "preview":
                if(previewWidth == "50vw"){
                    setPreviewWidth("100vw")
                    setCodeWidth("0vw");
                    setPreviewBtnText("Collapse Preview")
                } else{
                    setCodeWidth("50vw")
                    setPreviewWidth("50vw");
                    setPreviewBtnText("Expand Preview")

                }
                break;
        }
    }

    const editSettings = () => {
        
    }

    useEffect(() => {
        db_ref.sketches.get(sketch_id).then(record => {
            setScript(record.source)
        })
        db_ref.settings.get(1).then(record => {
            setSettings(record.config)
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
                <div>
                    <button onClick={() => expandHandler({panel:"code"})} className="button-action panel-option">{codeBtnText}</button>
                    <button onClick={() => {setSettingsOpen(!settingsOpen); setEditBtnText(!settingsOpen ? "Close Settings": "Open Settings")}} className="button-action panel-option">{editBtnText}</button>
                </div>
                <div>
                    <button onClick={() => {setIsLive(!isLive);setIScript(script)}} className={`button-action panel-option ${!isLive ? 'green': 'red'}`}>{isLive ? "Disable" : "Enable"} Live Preview</button>
                    <button onClick={() => expandHandler({panel:"preview"})} className="button-action panel-option">{previewBtnText}</button>
                </div>
            </div>
            <div className="app-container">
                    {settingsOpen &&
                    <Editor
                    height="90vh"
                    width={codeWidth}
                    theme="vs-dark"
                    defaultLanguage="json"
                    options={{fontSize:16}}
                    value={settings}
                    className="editor"
                    onMount={handleSettingsEditorDidMount}
                    onChange={handleSettingsEditorChange}
                    />}
                    
                    {!settingsOpen &&
                    <>
                    <Editor
                    height="90vh"
                    width={codeWidth}
                    theme="vs-dark"
                    options={JSON.parse(settings)}
                    defaultLanguage="javascript"
                    value={script}
                    className="editor"
                    onMount={handleEditorDidMount}
                    onChange={handleEditorChange}
                    />
                    
                    <div className="frame-section" style={{width:previewWidth}}>
                        <iframe ref={iframeRef} className="pframe" frameBorder="0" marginWidth="0" marginHeight="0" srcDoc={codegen(iscript)}></iframe>
                    </div>
                    </>}
            </div>
        </>
    )
}
