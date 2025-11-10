import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { formatINR } from '../lib/format';

export default function ProductCard({ product }) {
  return (
    <div className="card shadow-elevated overflow-hidden animate-fade-in group">
      <Link to={`/product/${product._id}`}>
  <div className="relative h-64 overflow-hidden bg-purple-100">
          <img
            src={product.images[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
          <div className="absolute left-3 top-3">
            <span className="badge bg-white/90 backdrop-blur text-gray-800 shadow">{product.category}</span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 transition-colors duration-200 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            ({product.numReviews})
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-purple-600">
              {formatINR(product.price)}
            </span>
            <p className="text-xs text-gray-500">Stock: {product.stock}</p>
          </div>

          <Link
            to={`/product/${product._id}`}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed animate-scale-in"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>View</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

