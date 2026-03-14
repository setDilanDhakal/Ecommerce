import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import Story from './pages/Story.jsx'
import Cart from './pages/Cart.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Footer from './components/Footer.jsx'
import AuthProvider from './context/AuthContext.jsx'

function App(){
  return(
    <>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/detail" element={<ProductDetail />} />
          <Route path="/story" element={<Story />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
      
    </>
  )
}

export default App
