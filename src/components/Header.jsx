import React, {useState} from 'react'
import './App.css'
import {Link} from 'react-router-dom'
import ContentEditable from "react-contenteditable";

export default function Header(props) {

    const [html, setHtml] = useState(props.sketchTitle)


    return (
        <div className="header-bar">
            <Link to='/'><h1 className="hb-text">p5 ide</h1></Link>
            <h3>{props.sketchTitle}</h3>
            { props.isEditor &&
                <div>
                    <button className="button-action" onClick={props.reloadHandler}>Reload</button>
                    <button className="button-action" onClick={props.exportHandler}>Export</button>
                </div>


            }
        </div>

    )
}
