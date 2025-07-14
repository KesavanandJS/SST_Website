import React, { useState } from 'react';
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
      image: "https://images.samsung.com/is/image/samsung/assets/levant/smartphones/galaxy-s24-ultra/buy/01_S24Ultra-Group-KV_MO.jpg?imbypass=true",
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
    },
    // New products added
    {
      id: 9,
      name: "OnePlus 12 Pro",
      price: 79999,
      originalPrice: 84999,
      image: "https://cdn.storifyme.xyz/accounts/cashify-in-0561312/assets/f-51-37661724956019526.png?t=1727785915000",
      category: "Smartphones",
      discount: 6,
      rating: 4.5,
      isNew: true,
      specs: {
        processor: "Snapdragon 8 Gen 3",
        display: "6.82-inch LTPO AMOLED",
        storage: "256GB",
        camera: "50MP Triple Camera",
        battery: "5400mAh",
        os: "OxygenOS 14"
      }
    },
    {
      id: 10,
      name: "HP Pavilion Gaming Desktop",
      price: 89999,
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=400&fit=crop&crop=center",
      category: "Gaming",
      rating: 4.4,
      specs: {
        processor: "Intel Core i5-13400F",
        memory: "16GB DDR4",
        storage: "512GB SSD + 1TB HDD",
        graphics: "NVIDIA GTX 1660 Super",
        os: "Windows 11 Home",
        ports: "USB 3.0, HDMI, DisplayPort"
      }
    },
    {
      id: 11,
      name: "Samsung Galaxy Tab S9+",
      price: 67999,
      originalPrice: 72999,
      image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop&crop=center",
      category: "Tablets",
      discount: 7,
      rating: 4.6,
      specs: {
        processor: "Snapdragon 8 Gen 2",
        display: "12.4-inch Super AMOLED",
        storage: "256GB",
        camera: "13MP + 8MP Ultra Wide",
        battery: "10090mAh",
        features: "S Pen included"
      }
    },
    {
      id: 12,
      name: "JBL Charge 5 Bluetooth Speaker",
      price: 13999,
      originalPrice: 15999,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center",
      category: "Audio",
      discount: 13,
      rating: 4.3,
      specs: {
        driver: "Racetrack-shaped driver",
        battery: "20 hours playtime",
        connectivity: "Bluetooth 5.1",
        waterproof: "IP67 rated",
        features: "PartyBoost, USB-C charging",
        weight: "960g"
      }
    },
    {
      id: 13,
      name: "Lenovo ThinkPad E15",
      price: 54999,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center",
      category: "Laptops",
      rating: 4.2,
      specs: {
        processor: "AMD Ryzen 5 5500U",
        display: "15.6-inch FHD IPS",
        memory: "8GB DDR4",
        storage: "256GB SSD",
        graphics: "AMD Radeon Graphics",
        os: "Windows 11 Home"
      }
    },
    {
      id: 14,
      name: "Xiaomi Mi TV 55-inch 4K",
      price: 43999,
      originalPrice: 49999,
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center",
      category: "Smart TV",
      discount: 12,
      rating: 4.4,
      specs: {
        display: "55-inch 4K Ultra HD",
        resolution: "3840 x 2160",
        smartTV: "Android TV 11",
        hdr: "HDR10+ Support",
        audio: "30W Dolby Audio",
        connectivity: "Wi-Fi, Bluetooth, 3x HDMI"
      }
    },
    {
      id: 15,
      name: "Canon EOS R50 Mirrorless Camera",
      price: 54999,
      image: "https://www.dpreview.com/files/p/articles/6952765962/Canon_EOS_R50_flash.jpeg",
      category: "Cameras",
      rating: 4.7,
      isNew: true,
      specs: {
        sensor: "24.2MP APS-C CMOS",
        processor: "DIGIC X",
        video: "4K UHD at 30fps",
        viewfinder: "2.36M-dot OLED EVF",
        display: "3.0-inch Vari-angle LCD",
        connectivity: "Wi-Fi, Bluetooth"
      }
    },
    {
      id: 16,
      name: "Nintendo Switch OLED",
      price: 31999,
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&crop=center",
      category: "Gaming",
      rating: 4.8,
      specs: {
        display: "7-inch OLED Screen",
        storage: "64GB Internal",
        battery: "4.5-9 hours",
        modes: "TV, Tabletop, Handheld",
        connectivity: "Wi-Fi, Bluetooth 4.1",
        features: "Enhanced Audio, Adjustable Stand"
      }
    },
    {
      id: 17,
      name: "Apple Watch Series 9 GPS",
      price: 41999,
      originalPrice: 44999,
      image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop&crop=center",
      category: "Wearables",
      discount: 7,
      rating: 4.6,
      specs: {
        processor: "S9 SiP",
        display: "45mm Retina LTPO OLED",
        storage: "64GB",
        battery: "18 hours",
        features: "Double Tap, Siri, ECG",
        waterResistance: "50 meters"
      }
    },
    {
      id: 18,
      name: "Dyson V15 Detect Cordless Vacuum",
      price: 54999,
      originalPrice: 59999,
      image: "https://cb.scene7.com/is/image/Crate/DysonSubmarineWtVacSSF23_VND/$web_pdp_carousel_low$/240201143746/dyson-submarine-wet-vacuum.jpg",
      category: "Home Appliances",
      discount: 8,
      rating: 4.5,
      specs: {
        motor: "Hyperdymium motor",
        battery: "60 minutes runtime",
        technology: "Laser detect technology",
        filtration: "Whole-machine HEPA",
        weight: "3.5kg",
        features: "LCD screen, 5 cleaning modes"
      }
    },
    {
      id: 19,
      name: "Bose QuietComfort Earbuds",
      price: 24999,
      originalPrice: 28999,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop&crop=center",
      category: "Audio",
      discount: 14,
      rating: 4.5,
      specs: {
        noiseCancellation: "World-class ANC",
        battery: "6+12 hours",
        driver: "Custom drivers",
        connectivity: "Bluetooth 5.1",
        features: "Touch controls, IPX4",
        charging: "USB-C, Wireless charging"
      }
    },
    {
      id: 20,
      name: "Google Pixel 8 Pro",
      price: 84999,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center",
      category: "Smartphones",
      rating: 4.6,
      isNew: true,
      specs: {
        processor: "Google Tensor G3",
        display: "6.7-inch LTPO OLED",
        storage: "128GB",
        camera: "50MP Triple Camera System",
        battery: "5050mAh",
        os: "Android 14"
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

  const categories = ['All', 'Smartphones', 'Laptops', 'Audio', 'Tablets', 'Gaming', 'Smart TV', 'Cameras', 'Wearables', 'Home Appliances'];

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
    } else {
      alert('You can only compare up to 3 products!');
    }
  };

  const removeFromCompare = (productId) => {
    setCompareList(compareList.filter(item => item.id !== productId));
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const openWishlist = () => {
    setIsWishlistOpen(true);
  };

  const closeWishlist = () => {
    setIsWishlistOpen(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleLogout = () => {
    onLogout();
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
          <div className="logo">ElectroStore</div>
          
          <div className="search-bar">
            <input 
              type="text" 
              className="search-input"
              placeholder="Search electronics..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          
          <div className="header-actions">
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Best Discount</option>
            </select>
          </div>
          
          <div className="user-info">
            <button className="wishlist-count" onClick={openWishlist}>
              ♡ Wishlist ({wishlist.length})
            </button>
            <button className="cart-count" onClick={openCart}>
              🛒 Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})
            </button>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="main-content">
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
              <button 
                className="filter-tag" 
                onClick={() => setSortBy('discount')}
              >
                🏷️ Best Deals
              </button>
              <button 
                className="filter-tag" 
                onClick={() => {
                  const newProducts = products.filter(p => p.isNew);
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                ✨ New Arrivals
              </button>
              <button 
                className="filter-tag" 
                onClick={() => setSortBy('price-low')}
              >
                💰 Budget Friendly
              </button>
            </div>
          </div>
        </aside>

        <section className="products-section">
          <div className="products-header">
            <h2>
              {selectedCategory === 'All' ? 'All Electronics' : selectedCategory}
              <span style={{fontSize: '1rem', color: '#6c757d', marginLeft: '10px'}}>
                ({filteredProducts.length} products)
              </span>
            </h2>
            <div className="view-options">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <div className="product-badges">
                      {product.isNew && <span className="badge new">NEW</span>}
                      {product.discount && <span className="badge discount">-{product.discount}%</span>}
                    </div>
                    <div className="product-overlay">
                      <button 
                        className="quick-view"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-specs">
                      Rating: {product.rating} ★ | {Object.keys(product.specs || {}).length} specs
                    </div>
                    
                    <div className="price-container">
                      <span className="product-price">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="original-price">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    
                    <div className="product-actions">
                      <button 
                        className="add-to-cart-btn" 
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                      <div className="secondary-actions">
                        <button 
                          className="wishlist-btn" 
                          onClick={() => addToWishlist(product)}
                          title="Add to Wishlist"
                        >
                          ♡
                        </button>
                        <button 
                          className="compare-btn" 
                          onClick={() => addToCompare(product)}
                          title="Compare"
                        >
                          ⚖
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {isCartOpen && (
        <Cart 
          items={cartItems} 
          onClose={closeCart} 
          onRemove={(id) => setCartItems(cartItems.filter(item => item.id !== id))} 
          onQuantityChange={setCartItems} 
        />
      )}
      
      {isWishlistOpen && (
        <Wishlist 
          items={wishlist} 
          onClose={closeWishlist} 
          onRemove={removeFromWishlist}
          onAddToCart={addToCart}
        />
      )}
      
      {selectedProduct && (
        <ProductDetails 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          addToCart={addToCart} 
          addToWishlist={addToWishlist}
          compareProducts={addToCompare}
        />
      )}

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 ElectroStore. All rights reserved. | Premium Electronics Store</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
