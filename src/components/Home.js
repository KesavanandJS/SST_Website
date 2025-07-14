import React, { useState, useEffect } from 'react';
import Cart from './Cart';
import ProductDetails from './ProductDetails';
import Wishlist from './Wishlist';
import './Home.css';

const Home = ({ user, onLogout }) => {
  const [products] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      price: 99900,
      originalPrice: 109900,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=center",
      category: "Smartphones",
      isNew: true,
      discount: 9,
      rating: 4.8,
      specs: {
        processor: "A17 Pro Bionic",
        display: "6.7-inch Super Retina XDR",
        storage: "256GB",
        camera: "48MP Triple Camera",
        battery: "29+ hours video playback",
        os: "iOS 17"
      }
    },
    {
      id: 2,
      name: "MacBook Pro 16-inch M3",
      price: 209900,
      originalPrice: 229900,
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center",
      category: "Laptops",
      isNew: true,
      discount: 9,
      rating: 4.9,
      specs: {
        processor: "Apple M3 Pro",
        display: "16-inch Liquid Retina XDR",
        memory: "18GB Unified Memory",
        storage: "512GB SSD",
        graphics: "12-core GPU",
        battery: "22 hours"
      }
    },
    {
      id: 3,
      name: "Samsung Galaxy S24 Ultra",
      price: 109999,
      image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&crop=center",
      category: "Smartphones",
      rating: 4.7,
      specs: {
        processor: "Snapdragon 8 Gen 3",
        display: "6.8-inch Dynamic AMOLED 2X",
        storage: "256GB",
        camera: "200MP Quad Camera",
        battery: "5000mAh",
        os: "Android 14"
      }
    },
    {
      id: 4,
      name: "AirPods Pro (3rd Gen)",
      price: 20900,
      originalPrice: 23499,
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop&crop=center",
      category: "Audio",
      discount: 11,
      rating: 4.6,
      specs: {
        chip: "H2 Chip",
        noiseCancellation: "Active Noise Cancellation",
        battery: "6+24 hours",
        charging: "MagSafe & Lightning",
        features: "Spatial Audio, Hey Siri",
        waterResistance: "IPX4"
      }
    },
    {
      id: 5,
      name: "Dell XPS 13 Plus",
      price: 119999,
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop&crop=center",
      category: "Laptops",
      rating: 4.5,
      specs: {
        processor: "Intel Core i7-13700H",
        display: "13.4-inch OLED InfinityEdge",
        memory: "16GB LPDDR5",
        storage: "512GB PCIe SSD",
        graphics: "Intel Iris Xe",
        os: "Windows 11 Pro"
      }
    },
    {
      id: 6,
      name: "iPad Pro 12.9-inch M2",
      price: 92999,
      originalPrice: 99999,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center",
      category: "Tablets",
      discount: 7,
      rating: 4.8,
      specs: {
        processor: "Apple M2",
        display: "12.9-inch Liquid Retina XDR",
        storage: "128GB",
        camera: "12MP Ultra Wide + 10MP",
        connectivity: "Wi-Fi 6E",
        os: "iPadOS 17"
      }
    },
    {
      id: 7,
      name: "Sony WH-1000XM5",
      price: 33999,
      originalPrice: 37999,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center",
      category: "Audio",
      discount: 11,
      rating: 4.7,
      specs: {
        driver: "30mm Dynamic",
        noiseCancellation: "Industry-leading ANC",
        battery: "30 hours",
        charging: "USB-C, Quick Charge",
        codec: "LDAC, AAC, SBC",
        weight: "250g"
      }
    },
    {
      id: 8,
      name: "ASUS ROG Strix Gaming Laptop",
      price: 159999,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop&crop=center",
      category: "Gaming",
      rating: 4.6,
      specs: {
        processor: "AMD Ryzen 7 7700HX",
        display: "15.6-inch 144Hz IPS",
        memory: "16GB DDR5",
        storage: "1TB PCIe SSD",
        graphics: "NVIDIA RTX 4060",
        cooling: "ROG Intelligent Cooling"
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const categories = ['All', 'Smartphones', 'Laptops', 'Audio', 'Tablets', 'Gaming'];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'discount':
          return (b.discount || 0) - (a.discount || 0);
        default:
          return 0;
      }
    });

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const addToWishlist = (product) => {
    if (!wishlist.find(item => item.id === product.id)) {
      setWishlist([...wishlist, product]);
      alert(`${product.name} added to wishlist!`);
    } else {
      alert('Product already in wishlist!');
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => item.id !== productId));
  };

  const addToCompare = (product) => {
    if (compareList.length < 3 && !compareList.find(item => item.id === product.id)) {
      setCompareList([...compareList, product]);
      alert(`${product.name} added to comparison!`);
    } else if (compareList.length >= 3) {
      alert('You can compare maximum 3 products!');
    } else {
      alert('Product already in comparison!');
    }
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">⚡ ElectroStore India</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search electronics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="header-actions">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Best Deals</option>
            </select>
          </div>
          <div className="user-info">
            <span>Welcome, {user.firstName}!</span>
            <button className="wishlist-count" onClick={() => setIsWishlistOpen(true)}>
              ♡ Wishlist ({wishlist.length})
            </button>
            <button className="compare-count" onClick={() => alert(`${compareList.length} items to compare`)}>
              ⚖ Compare ({compareList.length})
            </button>
            <button className="cart-count" onClick={() => setIsCartOpen(true)}>
              🛒 Cart ({getTotalCartItems()})
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
                <span className="category-count">
                  ({category === 'All' ? products.length : products.filter(p => p.category === category).length})
                </span>
              </li>
            ))}
          </ul>
          
          <div className="filters">
            <h4>Quick Filters</h4>
            <div className="filter-tags">
              <button className="filter-tag" onClick={() => setSortBy('discount')}>
                🏷️ On Sale
              </button>
              <button className="filter-tag" onClick={() => {
                const newProducts = products.filter(p => p.isNew);
                setSelectedCategory('All');
                setSearchTerm('');
              }}>
                ✨ New Arrivals
              </button>
              <button className="filter-tag" onClick={() => setSortBy('price-low')}>
                💰 Budget Friendly
              </button>
            </div>
          </div>
        </aside>

        <section className="products-section">
          <div className="products-header">
            <h2>Featured Electronics ({filteredProducts.length} products)</h2>
            <div className="view-options">
              <span>Showing {filteredProducts.length} of {products.length} products</span>
            </div>
          </div>
          
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image"
                    onClick={() => setSelectedProduct(product)}
                  />
                  <div className="product-badges">
                    {product.isNew && <span className="badge new">NEW</span>}
                    {product.discount && <span className="badge discount">-{product.discount}%</span>}
                  </div>
                  <div className="product-overlay">
                    <button onClick={() => setSelectedProduct(product)} className="quick-view">
                      👁️ Quick View
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  {product.specs && (
                    <p className="product-specs">
                      {Object.values(product.specs)[0]}
                    </p>
                  )}
                  <div className="price-container">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="original-price">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="product-actions">
                    <button
                      onClick={() => addToCart(product)}
                      className="add-to-cart-btn"
                    >
                      🛒 Add to Cart
                    </button>
                    <div className="secondary-actions">
                      <button 
                        onClick={() => addToWishlist(product)}
                        className="wishlist-btn"
                        title="Add to Wishlist"
                      >
                        ♡
                      </button>
                      <button 
                        onClick={() => addToCompare(product)}
                        className="compare-btn"
                        title="Add to Compare"
                      >
                        ⚖
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateCartItems={setCartItems}
        user={user}
      />

      <Wishlist
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        removeFromWishlist={removeFromWishlist}
        addToCart={addToCart}
      />

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart}
          addToWishlist={addToWishlist}
          compareProducts={addToCompare}
        />
      )}
    </div>
  );
};

export default Home;
