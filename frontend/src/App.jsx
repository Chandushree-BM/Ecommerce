import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Home from './pages/user/Home';
import ProductDetails from './pages/user/ProductDetails';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Orders from './pages/user/Orders';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import AdminOrders from './pages/admin/Orders';
import OrderDetail from './pages/admin/OrderDetail';

const Protected = ({ children }) => {
  const token = useSelector(s => s.auth.token);
  return token ? children : <Navigate to="/login" />;
};

const AdminProtected = ({ children }) => {
  const user = useSelector(s => s.auth.user);
  return user?.role === 'admin' ? children : <Navigate to="/admin/login" />;
};

export default function App(){
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes>
      {/* User */}
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
      <Route path="/orders" element={<Protected><Orders /></Protected>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminProtected><Dashboard /></AdminProtected>} />
      <Route path="/admin/products" element={<AdminProtected><Products /></AdminProtected>} />
      <Route path="/admin/products/new" element={<AdminProtected><ProductForm /></AdminProtected>} />
      <Route path="/admin/products/:id" element={<AdminProtected><ProductForm /></AdminProtected>} />
      <Route path="/admin/orders" element={<AdminProtected><AdminOrders /></AdminProtected>} />
      <Route path="/admin/orders/:id" element={<AdminProtected><OrderDetail /></AdminProtected>} />
    </Routes>
    </>
  );
}
