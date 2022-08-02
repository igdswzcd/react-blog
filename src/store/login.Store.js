import { http, setToken, getToken, clearToken } from '@/utils'
import { makeAutoObservable } from 'mobx'

class LoginStore {
	token = getToken() || ''
	constructor() {
		makeAutoObservable(this)
	}

	logOut = () => {
		this.token = ''
		clearToken()
	}
	login = async ({ mobile, code }) => {
		const res = await http.post('http://geek.itheima.net/v1_0/authorizations', { mobile, code })
		this.token = res.data.token
		setToken(res.data.token)
	}
}

export default LoginStore
