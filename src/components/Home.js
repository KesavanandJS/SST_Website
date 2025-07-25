import React, { useState, useEffect } from 'react';
import Cart from './Cart';
import ProductDetailsModal from './ProductDetailsModal';
import FiltersModal from './FiltersModal';
import CartModal from './CartModal';
import CompareModal from './CompareModal';
import AdminDashboard from './AdminDashboard';
import './Home.css';

const Home = ({ user, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
    rating: ''
  });

  const categories = ['All', 'Tapes', 'Wicks', 'Cotton Wicks', 'Fabric Tapes', 'Binding Tapes', 'Elastic Tapes', 'Twill Tapes', 'Herringbone Tapes'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, filters]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const loadUserData = async () => {
    try {
      const headers = getAuthHeaders();
      
      // Load cart
      const cartResponse = await fetch('http://localhost:8000/api/user/cart', { headers });
      if (cartResponse.ok) {
        const cartResult = await cartResponse.json();
        if (cartResult.success) {
          const cartItems = cartResult.cart.map(item => ({
            ...item.productId,
            _id: item.productId._id,
            quantity: item.quantity
          }));
          setCart(cartItems);
        }
      }

      // Load wishlist
      const wishlistResponse = await fetch('http://localhost:8000/api/user/wishlist', { headers });
      if (wishlistResponse.ok) {
        const wishlistResult = await wishlistResponse.json();
        if (wishlistResult.success) {
          const wishlistItems = wishlistResult.wishlist.map(item => ({
            ...item.productId,
            _id: item.productId._id
          }));
          setWishlist(wishlistItems);
        }
      }

      // Load compare list
      const compareResponse = await fetch('http://localhost:8000/api/user/compare', { headers });
      if (compareResponse.ok) {
        const compareResult = await compareResponse.json();
        if (compareResult.success) {
          const compareItems = compareResult.compare.map(item => ({
            ...item.productId,
            _id: item.productId._id
          }));
          setCompareList(compareItems);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.inStock) params.append('inStock', 'true');
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`http://localhost:8000/api/products?${params}`);
      const result = await response.json();
      if (result.success) {
        // Ensure each product has required fields
        const productsWithDefaults = result.products.map(product => ({
          ...product,
          rating: product.rating || 4.5,
          discount: product.discount || 0,
          originalPrice: product.originalPrice || null,
          isNew: product.isNew || false
        }));
        setProducts(productsWithDefaults);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Set some default products if fetch fails
      setProducts([]);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = (!filters.minPrice || product.price >= filters.minPrice) &&
                        (!filters.maxPrice || product.price <= filters.maxPrice);
    const matchesBrand = !filters.brand || 
                        product.brand.toLowerCase().includes(filters.brand.toLowerCase());
    const matchesRating = !filters.rating || product.rating >= filters.rating;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesRating;
  });

  const addToCart = async (product) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:8000/api/user/cart', {
        method: 'POST',
        headers,
        body: JSON.stringify({ productId: product._id, quantity: 1 })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const cartItems = result.cart.map(item => ({
            ...item.productId,
            _id: item.productId._id,
            quantity: item.quantity
          }));
          setCart(cartItems);
          alert(`${product.name} added to cart!`);
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const addToWishlist = async (product) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:8000/api/user/wishlist', {
        method: 'POST',
        headers,
        body: JSON.stringify({ productId: product._id })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const wishlistItems = result.wishlist.map(item => ({
            ...item.productId,
            _id: item.productId._id
          }));
          setWishlist(wishlistItems);
          alert(`${product.name} added to wishlist!`);
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist');
    }
  };

  const addToCompare = async (product) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:8000/api/user/compare', {
        method: 'POST',
        headers,
        body: JSON.stringify({ productId: product._id })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const compareItems = result.compare.map(item => ({
            ...item.productId,
            _id: item.productId._id
          }));
          setCompareList(compareItems);
          alert(`${product.name} added to compare!`);
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add to compare');
      }
    } catch (error) {
      console.error('Error adding to compare:', error);
      alert('Failed to add to compare');
    }
  };

  const viewProductDetails = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}`);
      const result = await response.json();
      if (result.success) {
        setSelectedProduct(result.product);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:8000/api/user/wishlist/${productId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const wishlistItems = result.wishlist.map(item => ({
            ...item.productId,
            _id: item.productId._id
          }));
          setWishlist(wishlistItems);
        }
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:8000/api/user/cart/${productId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ quantity })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const cartItems = result.cart.map(item => ({
            ...item.productId,
            _id: item.productId._id,
            quantity: item.quantity
          }));
          setCart(cartItems);
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:8000/api/user/cart/${productId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const cartItems = result.cart.map(item => ({
            ...item.productId,
            _id: item.productId._id,
            quantity: item.quantity
          }));
          setCart(cartItems);
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const removeFromCompare = async (productId) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:8000/api/user/compare/${productId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const compareItems = result.compare.map(item => ({
            ...item.productId,
            _id: item.productId._id
          }));
          setCompareList(compareItems);
        }
      }
    } catch (error) {
      console.error('Error removing from compare:', error);
    }
  };

  const closeWishlist = () => {
    setShowWishlist(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Check if user exists and has admin role
  if (user?.role === 'admin') {
    return <AdminDashboard admin={user} onLogout={onLogout} />;
  }

  // If user doesn't exist, return null or redirect to login
  if (!user) {
    return null;
  }

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">🧵 Sri Saravana Textile</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search tapes, wicks, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="user-info">
            <span>Welcome, {user.firstName}!</span>
            <button onClick={() => setShowFilters(true)} className="filter-btn">
              🔍 Filters
            </button>
            <button onClick={() => setShowWishlist(true)} className="wishlist-btn">
              ♡ Wishlist ({wishlist.length})
            </button>
            <button onClick={() => setShowCart(true)} className="cart-btn">
              🛒 Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </button>
            <button onClick={() => setShowCompare(true)} className="compare-btn">
              ⚖ Compare ({compareList.length})
            </button>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul className="category-list">
            {categories.map(category => (
              <li
                key={category}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        <section className="products-section">
          <h2>🧵 Tapes & Wicks Collection ({filteredProducts.length})</h2>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={product.images?.[0] || product.image || 'https://via.placeholder.com/300x300?text=Tape+%2F+Wick'} 
                    alt={product.name} 
                    className="product-image"
                    onClick={() => viewProductDetails(product._id)}
                  />
                  {product.originalPrice > product.price && (
                    <div className="discount-badge">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name" onClick={() => viewProductDetails(product._id)}>
                    {product.name}
                  </h3>
                  <p className="product-brand">{product.brand}</p>
                  <p className="product-category">{product.category}</p>
                  <div className="product-specs">
                    {product.specifications?.width && <span>Width: {product.specifications.width}</span>}
                    {product.specifications?.material && <span>Material: {product.specifications.material}</span>}
                  </div>
                  <div className="price-container">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    <span className="unit-text">per {product.unit || 'Kg'}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="original-price">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="stock-info">
                    {product.stock > 0 ? (
                      <span className="in-stock">✅ {product.stock} {product.unit || 'Kg'} available</span>
                    ) : (
                      <span className="out-of-stock">❌ Out of stock</span>
                    )}
                    {product.minimumOrder && (
                      <span className="min-order">Min order: {product.minimumOrder} {product.unit || 'Kg'}</span>
                    )}
                  </div>
                  <div className="rating">
                    {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                    <span>({product.rating})</span>
                  </div>
                  <div className="product-actions">
                    <button 
                      onClick={() => addToCart(product)} 
                      className="add-to-cart-btn"
                      disabled={product.stock === 0}
                    >
                      🛒 Add to Cart
                    </button>
                    <button onClick={() => addToWishlist(product)} className="wishlist-heart-btn">
                      ♡
                    </button>
                    <button onClick={() => addToCompare(product)} className="compare-btn-small">
                      ⚖
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onAddToWishlist={addToWishlist}
          onAddToCompare={addToCompare}
        />
      )}

      {/* Filters Modal */}
      {showFilters && (
        <FiltersModal 
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilters(false)}
          products={products}
        />
      )}

      {/* Cart Modal */}
      {showCart && (
        <CartModal 
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCart(false)}
          updateCartQuantity={updateCartQuantity}
          removeFromCart={removeFromCart}
        />
      )}

      {/* Compare Modal */}
      {showCompare && (
        <CompareModal 
          compareList={compareList}
          setCompareList={setCompareList}
          onClose={() => setShowCompare(false)}
          onAddToCart={addToCart}
          removeFromCompare={removeFromCompare}
        />
      )}

      {/* Wishlist Modal */}
      {showWishlist && (
        <div className="modal-overlay" onClick={closeWishlist}>
          <div className="wishlist-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>My Wishlist ({wishlist.length})</h3>
              <button onClick={closeWishlist} className="close-btn">×</button>
            </div>
            <div className="modal-content">
              {wishlist.length === 0 ? (
                <div className="empty-wishlist">
                  <div className="empty-icon">♡</div>
                  <h4>Your wishlist is empty</h4>
                  <p>Save your favorite items to buy them later!</p>
                </div>
              ) : (
                <div className="wishlist-items">
                  {wishlist.map(product => (
                    <div key={product._id} className="wishlist-item">
                      <img src={product.images?.[0] || product.image || 'https://via.placeholder.com/300x300?text=No+Image'} alt={product.name} />
                      <div className="item-details">
                        <h4>{product.name}</h4>
                        <p className="item-price">{formatPrice(product.price)}</p>
                        <p className="item-category">{product.category}</p>
                      </div>
                      <div className="item-actions">
                        <button
                          onClick={() => addToCart(product)}
                          className="add-to-cart-small"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product._id)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
