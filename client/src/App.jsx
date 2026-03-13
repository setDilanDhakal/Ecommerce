import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import Story from './pages/Story.jsx'
import Cart from './pages/Cart.jsx'
import Footer from './components/Footer.jsx'

function App(){
  return(
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product" element={<Product />} />
        <Route path="/story" element={<Story />} />
      </Routes>
      <Footer />
    </BrowserRouter>
      
    </>
  )
}

export default App