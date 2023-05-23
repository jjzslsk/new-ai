import axios, { type AxiosResponse } from 'axios'
import { setUserSession, getUserSession } from '@/utils/functions'
// import { useAuthStore } from '@/store'

//设置session (new Date()).valueOf() 时间戳后期也可替换为用户token
setUserSession({key: "user_id", value: (new Date()).valueOf()})
//请求头携带session
axios.defaults.headers.common['Session'] = getUserSession("user_id")

const service = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL,
})

service.interceptors.request.use(
  (config) => {

    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
