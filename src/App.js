import './App.css'
import { Routes, Route } from 'react-router-dom'
import { HistoryRouter, history } from './utils/history'
import { AuthRoute } from './components/AuthRoute'
import BlogLayout from './pages/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import Article from './pages/Article'
import Publish from './pages/Publish'
function App() {
	return (
		<HistoryRouter history={history}>
			<div className='App'>
				<Routes>
					<Route
						path='/'
						element={
							<AuthRoute>
								<BlogLayout></BlogLayout>
							</AuthRoute>
						}>
						<Route index element={<Home></Home>}></Route>
						<Route path='article' element={<Article></Article>}></Route>
						<Route path='publish' element={<Publish></Publish>}></Route>
					</Route>
					<Route path='/login' element={<Login></Login>}></Route>
				</Routes>
			</div>
		</HistoryRouter>
	)
}

export default App
