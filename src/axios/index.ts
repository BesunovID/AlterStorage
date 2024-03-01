import axios from "axios";

export default axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 15000,
    headers: {
        'Authorization': `Token ${localStorage.getItem('TOKEN')}`,
    }
})