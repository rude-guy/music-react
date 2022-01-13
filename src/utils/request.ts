import axios, {AxiosResponse} from 'axios'

const appUrl = process.env.REACT_APP_API_URL

const instance = axios.create({
    baseURL: appUrl,
    timeout: 10000
})

instance.interceptors.response.use(
    (response: AxiosResponse): Promise<any> => {
        if (response.status === 200 && response.data) {
            console.log(response.data)
            return response.data
        } else {
            return Promise.reject(new Error('请求失败'))
        }
    },
    error => {
        return Promise.reject(error)
    }
)

export default instance
