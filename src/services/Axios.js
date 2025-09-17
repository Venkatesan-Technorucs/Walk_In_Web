import axios from "axios";

export const Axios = axios.create({
    baseURL:'https://walk-in-backend-4w8f.onrender.com',
    timeout:30000,
    headers:{
        'Content-Type':'application/json'
    }
})