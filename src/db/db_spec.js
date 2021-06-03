import Dexie from 'dexie';
import {createContext} from 'react'
let db = new Dexie('generative-db');
db.version(1).stores({
    sketches: '++id,name,source',
    settings: '++id,config',
});

db.settings.put({config:JSON.stringify({fontSize:12},null,"\t")});

export const DBContext = createContext(db)
export default db;