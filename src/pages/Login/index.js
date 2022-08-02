import { Card, Button, Checkbox, Form, Input, message } from 'antd'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import logo from '@/assets/logo.png'

function Login() {
	const navigate = useNavigate()
	const { loginStore } = useStore()
	const onFinish = async (values) => {
		const { phone, vericode } = values
		try {
			await loginStore.login({ mobile: phone, code: vericode })
			navigate('/', { replace: true })
			message.success('登录成功')
		} catch (e) {
			message.error(e.response?.data?.message || 'login failed')
		}
	}

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo)
	}
	return (
		<div className='login'>
			<Card className='login-container'>
				<img className='login-logo' src={logo} alt=''></img>
				<Form
					validateTrigger={['onBlur', 'onChange']}
					name='basic'
					labelCol={{
						span: 7
					}}
					// wrapperCol={{
					// 	span: 16
					// }}
					initialValues={{
						phone: '13911111111',
						vericode: '246810',
						remember: true
					}}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete='off'>
					<Form.Item
						label='手机号码'
						name='phone'
						rules={[
							{
								required: true,
								message: '请输入手机号码！'
							},
							{
								pattern: /^1[3-9]\d{9}$/,
								message: '号码格式错误',
								validateTrigger: 'onBlur'
							}
						]}>
						<Input />
					</Form.Item>

					<Form.Item
						label='验证码'
						name='vericode'
						rules={[
							{
								required: true,
								message: '请填写验证码！'
							},
							{
								len: 6,
								message: '验证码为6位',
								validateTrigger: 'onBlur'
							}
						]}>
						<Input.Password />
					</Form.Item>

					<Form.Item name='remember' valuePropName='checked'>
						<Checkbox>
							我已阅读并同意<a>用户协议</a>和<a>隐私条款</a>
						</Checkbox>
					</Form.Item>

					<Form.Item
						wrapperCol={{
							offset: 8,
							span: 16
						}}>
						<Button type='primary' htmlType='submit'>
							登录
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	)
}

export default Login
