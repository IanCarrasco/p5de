import React, {useRef, useState, useEffect} from 'react'
import './App.css'
import { Route, BrowserRouter as Router, Link } from 'react-router-dom';
import EditorView from './Editor'
import './App.css'
import db, {DBContext} from '../db/db_spec'
import Header from './Header'


export default function App() {

    const [sketches, setSketches] = useState([])
    const [modal, setModal] = useState(false)
    const [name, setName] = useState("")
    const refreshState = () =>{
        db.sketches.toArray().then(sks =>
            setSketches(sks))
    }


    const newSketchHandler = () => {
        setModal(true)
    }

    const createHandler = () => {
        db.sketches.put({name: name, source: ""});
        setModal(false)
        setName("")
        refreshState()
        
    }

    useEffect(() => {
        refreshState()
        return () => {
        }
    }, [])


    return (
            <Router>
                <Route exact path='/'>
                        <Header sketchTitle="" isEditor={false}></Header>
                        {modal &&
                        <div className="overlay-modal">
                            <div className="name-prompt">
                                <h2>Name your sketch.</h2>
                                <input type="text" onChange={e => setName(e.target.value)} value={name}></input>
                                <button className="button-action" onClick={createHandler}>Create</button>
                            </div>
                        </div>
                        }
                        <div className="gallery-container">
                            <div className="gallery-entry" onClick={newSketchHandler}>
                                <h1 className="plus-icon">+</h1>
                            </div>
                            {sketches.map(sketch =>
                                <Link to={"/editor/" + sketch.id} key={sketch.id}><div className="gallery-entry"><h3>{sketch.name}</h3></div></Link>
                            )}
                        </div>
                </Route>
                <DBContext.Provider value={db}>
                    <Route path='/editor/:id' component={EditorView}/>    
                </DBContext.Provider>
            </Router>

    )
}
