import { createContext, useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from './store-request-api'
import AuthContext from '../../auth'

export const GlobalStoreContext = createContext({});
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
}

// const tps = new jsTPS();

// const CurrentModal = {
//     NONE : "NONE",
//     DELETE_LIST : "DELETE_LIST",
//     EDIT_SONG : "EDIT_SONG",
//     REMOVE_SONG : "REMOVE_SONG"
// }

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
    });
    const history = useNavigate();
    const location = useLocation()
    const { auth } = useContext(AuthContext);
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({})
            }
        }
    }
    

}

