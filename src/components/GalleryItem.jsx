import React, {useState, useContext} from 'react'
import './App.css'
import {Link} from 'react-router-dom'
import db, {DBContext} from '../db/db_spec'


export default function GalleryItem(props) {
    const sketch = props.sketch
    const db_ref = useContext(DBContext)

    const [menuToggle, setMenuToggle] = useState(false)

    const deleteSketch = () => {
        console.log("Deleting Sketch...")
        db_ref.sketches.delete(sketch.id).then(res => {
            console.log(res)
        })
        props.refreshFn()
    }

    return (
        <>
        <div className="gallery-entry">
            {menuToggle && 
                <div className="sketchOptions">
                    <div onClick={()=>setMenuToggle(false)}>Close</div>
                    <div onClick={deleteSketch}>Delete</div>
                </div>
            }
            {!menuToggle &&
            <h3 className="menu-toggle" onClick={() => setMenuToggle(!menuToggle)}>⋮</h3>}
            <div className="title-block">
                <Link to={"/editor/" + sketch.id} key={sketch.id}><h3>{sketch.name}</h3></Link>
            </div>
        </div>
        </>
        
    )
}
