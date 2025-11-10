import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getProduct } from '../../store/productSlice';
import { addToCart } from '../../store/cartSlice';
import Navbar from '../../components/Navbar';
import { ShoppingCart, Star, Package, Truck } from 'lucide-react';
import { formatINR } from '../../lib/format';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, isLoading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity }));
    toast.success('Added to cart!');
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              <div className="mb-4 rounded-lg overflow-hidden bg-purple-100">
                  <img
                  src={product.images[selectedImage] || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                        className={`rounded-lg overflow-hidden border-2 ${
                          selectedImage === idx ? 'border-purple-600' : 'border-gray-200'
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-20 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.numReviews} reviews)
                </span>
              </div>

              <div className="mb-6">
                  <span className="text-4xl font-bold text-purple-600">
                  {formatINR(product.price)}
                </span>
              </div>

              <div className="mb-6">
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Package className="h-5 w-5" />
                  <span>Stock: {product.stock} units</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Truck className="h-5 w-5" />
                  <span>Weight: {product.weight} kg</span>
                </div>
              </div>

              {product.stock > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="text-gray-700 font-medium">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-2 hover:bg-purple-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="px-4 py-2 hover:bg-purple-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  Out of Stock
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
