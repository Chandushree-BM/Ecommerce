import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart } from '../../store/cartSlice';
import Navbar from '../../components/Navbar';
import { Trash2, ShoppingBag } from 'lucide-react';
import { formatINR } from '../../lib/format';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getCart());
    }
  }, [dispatch, user]);

  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ itemId, quantity }));
  };

  const handleRemove = (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      dispatch(removeFromCart(itemId));
    }
  };

  const subtotal = items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const shipping = subtotal > 500 ? 0 : 50; // amounts are in INR units already
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 mb-4">Please login to view your cart</p>
          <Link to="/login" className="text-purple-200 hover:text-purple-100 font-medium">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          </div>
        ) : items?.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link
              to="/"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items?.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.product?.name}
                      </h3>
                      <p className="text-gray-600">{formatINR(item.price)} each</p>

                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-x border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        {formatINR(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatINR(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>{formatINR(tax)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatINR(total)}</span>
                  </div>
                </div>

                {subtotal < 500 && (
                  <p className="text-sm text-gray-600 mb-4">
                    Add ${(500 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/"
                  className="block text-center text-blue-600 hover:text-blue-700 mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
