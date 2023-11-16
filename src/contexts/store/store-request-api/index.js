import axios from 'axios'
axios.defaults.withCredentials = true;
const baseURL = process.env.NODE_ENV !== 'development' ? 'https://cartistry-express.vercel.app' : 'http://localhost:4000'

const api = axios.create({
    baseURL
})
export const getDummyData = () => {
    return api.get('/') 
}



 
const apis = {
    getDummyData,
}

export default apis