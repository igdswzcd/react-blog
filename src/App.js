import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthRoute } from './components/AuthRoute'
import Layout from './pages/Layout'
import Login from './pages/Login'
function App() {
	return (
		<BrowserRouter>
			<div className='App'>
				<Routes>
					<Route
						path='/*'
						element={
							<AuthRoute>
								<Layout></Layout>
							</AuthRoute>
						}></Route>
					<Route path='/login' element={<Login></Login>}></Route>
				</Routes>
			</div>
		</BrowserRouter>
	)
}

export default App
