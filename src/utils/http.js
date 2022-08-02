import axios from 'axios'
import { history } from './history'
import { clearToken, getToken } from './token'

const http = axios.create({
	baseURL: 'http://geek.itheima.net/v1_0',
	timeout: 5000
})

http.interceptors.request.use(
	(config) => {
		const token = getToken()
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

http.interceptors.response.use(
	(response) => {
		return response.data
	},
	(error) => {
		if (error.response.status === 401) {
			clearToken()
			history.push('/login')
		}
		return Promise.reject(error)
	}
)

export { http }
