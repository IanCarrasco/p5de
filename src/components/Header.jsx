import React, {useState, useContext} from 'react'
import './App.css'
import {Link} from 'react-router-dom'
import ContentEditable from "react-contenteditable";
import db, {DBContext} from '../db/db_spec'

export default function Header(props) {

    const [html, setHtml] = useState(props.sketchTitle)
    const db_ref = useContext(DBContext)

    const blurHandler = (e) =>{
        props.titleHandler(e.currentTarget.innerText)
        db.sketches.update(props.sketch_id, {name: e.currentTarget.innerText}).then(function (updated) {
            if(updated){console.log ("Name updated.")};
        });
        props.refreshFn()
    }

    return (
        <div className="header-bar">
            <Link to='/'><h1 className="hb-text">p5 ide</h1></Link>
            <ContentEditable html={`<h3>${props.sketchTitle}</h3>`} onBlur={blurHandler}></ContentEditable>
            { props.isEditor &&
                <div>
                    <button className="button-action" onClick={props.reloadHandler}>Reload</button>
                    <button className="button-action" onClick={props.exportHandler}>Export</button>
                </div>


            }
        </div>

    )
}
