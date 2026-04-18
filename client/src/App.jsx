import Cart from './pages/Cart'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  const path = window.location.pathname

  if (path === '/register') {
    return <Register />
  }

  if (path === '/login') {
    return <Login />
  }

  if (path === '/cart') {
    return <Cart />
  }

  return <Home />
}

export default App
