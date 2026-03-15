import {BrowserRouter,Routes,Route,useLocation} from 'react-router-dom'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import Story from './pages/Story.jsx'
import About from './pages/About.jsx'
import Cart from './pages/Cart.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Profile from './pages/Profile.jsx'
import AdminProduct from './pages/AdminProduct.jsx'
import Footer from './components/Footer.jsx'
import AuthProvider from './context/AuthContext.jsx'

function AppLayout() {
  const location = useLocation()
  const hideFooter = location.pathname === "/admin"

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/detail/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/story" element={<Story />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<AdminProduct />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  )
}

function App(){
  return(
    <>
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
      
    </>
  )
}

export default App
