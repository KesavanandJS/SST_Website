import React from 'react';
import './Wishlist.css';

const Wishlist = ({ isOpen, onClose, wishlistItems, removeFromWishlist, addToCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  if (!isOpen) return null;

  return (
    <div className="wishlist-overlay">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h2>My Wishlist ({wishlistItems.length} items)</h2>
          <button className="close-wishlist" onClick={onClose}>×</button>
        </div>
        
        <div className="wishlist-content">
          {wishlistItems.length === 0 ? (
            <div className="empty-wishlist">
              <div className="empty-icon">♡</div>
              <h3>Your wishlist is empty</h3>
              <p>Add some products you love to see them here</p>
              <button className="continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlistItems.map(item => (
                <div key={item.id} className="wishlist-item">
                  <div className="wishlist-item-image">
                    <img src={item.image} alt={item.name} />
                    {item.discount && (
                      <span className="discount-badge">-{item.discount}%</span>
                    )}
                  </div>
                  <div className="wishlist-item-info">
                    <h4>{item.name}</h4>
                    <p className="category">{item.category}</p>
                    <div className="price-section">
                      <span className="current-price">{formatPrice(item.price)}</span>
                      {item.originalPrice && (
                        <span className="original-price">{formatPrice(item.originalPrice)}</span>
                      )}
                    </div>
                    <div className="wishlist-actions">
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        🛒 Add to Cart
                      </button>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
