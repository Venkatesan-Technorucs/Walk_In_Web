import axios from "axios";

export const Axios = axios.create({
    baseURL:'http://localhost:3000/',
    // timeout:10000,
    headers:{
        'Content-Type':'application/json'
    }
})

Axios.all = axios.all;