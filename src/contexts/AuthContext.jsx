import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useContext, useEffect, useReducer } from 'react'
import { createContext } from 'react'

export const AuthContext = createContext();

export let useAuth = () => {
    return useContext(AuthContext);
}

function userReducer(state, action) {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            localStorage.setItem("token", action.payload.token);
            return { ...state, user: action.payload, loading: false, error: null };
        case "REGISTER_SUCCESSFULL":
            return { ...state, user: action.payload, loading: false, error: null };
        case "TEST_STARTED":
            localStorage.setItem("test", JSON.stringify(action.payload.test))
            return { ...state, user: action.payload, loading: false, error: null };
        case "LOGOUT":
            localStorage.removeItem("token");
            localStorage.removeItem("test");
            return { ...initialState, loading: false };
        case "LOADING":
            return { ...state, loading: true };
        case "API_LOADING":
            return { ...state, apiLoading: action.payload };
        case "ERROR":
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
}

let initialState = {
    user: null,
    error: null,
    loading: true,
    apiLoading: false
};

let { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    let [state, dispatch] = useReducer(userReducer, initialState)
    useEffect(() => {
        let persistUser = async () => {
            let token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                console.log(decodedToken);
                const now = Date.now();
                if (now < decodedToken.exp * 1000) {
                    dispatch({ type: "LOGIN_SUCCESS", payload: { ...decodedToken, token: token } });
                } else {
                    dispatch({ type: "ERROR", payload: 'Token expired' })
                }
            }
            else {
                dispatch({ type: "LOGOUT" })
            }
        }
        persistUser();

    }, []);
    return (
        <Provider value={{ state, dispatch }}>
            {children}
        </Provider>
    )
}

export default AuthProvider