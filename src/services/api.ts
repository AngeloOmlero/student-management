import axios from "axios";
import  {useAuthStore } from "@/stores/auth.store.ts";
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use(config => {
    const authStore = useAuthStore()
    const token  = authStore.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => Promise.reject(error))

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            const authStore = useAuthStore()
            authStore.logout()
        }
        return Promise.reject(error)
    }

)
   
export default api