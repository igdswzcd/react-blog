import { Layout, Menu, Popconfirm } from 'antd'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { HomeOutlined, DiffOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import './index.scss'
import { useStore } from '@/store'
import { useEffect } from 'react'

const { Header, Sider } = Layout

function BlogLayout() {
	const location = useLocation()
	const { userStore, loginStore } = useStore()
	const selectedKey = location.pathname
	const menuItems = [
		{ label: <Link to='/'>可视数据</Link>, key: '/', icon: <HomeOutlined></HomeOutlined> },
		{ label: <Link to='/article'>文章管理</Link>, key: '/article', icon: <DiffOutlined></DiffOutlined> },
		{ label: <Link to='/publish'>发布编辑</Link>, key: '/publish', icon: <EditOutlined></EditOutlined> }
	]
	useEffect(() => {
		try {
			userStore.getUserInfo()
		} catch (error) {}
	}, [userStore])

	const navigate = useNavigate()
	const onLogout = () => {
		loginStore.logOut()
		navigate('/login')
	}

	return (
		<Layout>
			<Header className='header'>
				<div className='logo'></div>
				<div className='user-info'>
					<span className='user-name'>{userStore.userInfo.name}</span>
					<span className='user-logout'>
						<Popconfirm title='是否确认登出？' okText='退出' cancelText='取消' onConfirm={onLogout}>
							<LogoutOutlined></LogoutOutlined>
						</Popconfirm>
					</span>
				</div>
			</Header>
			<Layout>
				<Sider width={200} className='site-layout-background'>
					<Menu items={menuItems} mode='inline' theme='dark' selectedKeys={[selectedKey]} style={{ height: '100%', borderRight: 0 }}></Menu>
				</Sider>
				<Layout className='layout-content' style={{ padding: 20 }}>
					<Outlet></Outlet>
				</Layout>
			</Layout>
		</Layout>
	)
}

export default observer(BlogLayout)
