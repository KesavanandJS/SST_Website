import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ admin, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: 'Sri Saravana Textile',
    price: '',
    originalPrice: '',
    images: [''],
    category: 'Tapes',
    description: '',
    specifications: {
      material: '',
      width: '',
      thickness: '',
      color: '',
      pattern: '',
      length: '',
      weight: '',
      tensileStrength: '',
      washable: '',
      shrinkage: '',
      origin: '',
      gsm: '',
      weave: ''
    },
    features: [''],
    stock: '',
    unit: 'Kg',
    minimumOrder: 1
  });

  const categories = ['Tapes', 'Wicks', 'Cotton Wicks', 'Fabric Tapes', 'Binding Tapes', 'Elastic Tapes', 'Twill Tapes', 'Herringbone Tapes'];
  const units = ['Kg', 'Meters', 'Pieces'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products');
      const result = await response.json();
      if (result.success) {
        setProducts(result.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewProduct(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (index, field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (index, field) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      brand: 'Sri Saravana Textile',
      price: '',
      originalPrice: '',
      images: [''],
      category: 'Tapes',
      description: '',
      specifications: {
        material: '',
        width: '',
        thickness: '',
        color: '',
        pattern: '',
        length: '',
        weight: '',
        tensileStrength: '',
        washable: '',
        shrinkage: '',
        origin: '',
        gsm: '',
        weave: ''
      },
      features: [''],
      stock: '',
      unit: 'Kg',
      minimumOrder: 1
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          addedBy: admin?.username || 'admin'
        })
      });

      const result = await response.json();
      if (result.success) {
        setProducts([result.product, ...products]);
        resetForm();
        setShowAddForm(false);
        alert('Product added successfully!');
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Only show admin dashboard if user has admin role
  if (admin.role !== 'admin') {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1>Access Denied</h1>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
        <div className="admin-main">
          <p>You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>🏪 Sri Saravana Textile - Admin Dashboard</h1>
        <div className="admin-nav">
          <span>Welcome, {admin?.username || 'Admin'}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="admin-main">
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>📦 Total Products</h3>
            <p>{products.length}</p>
          </div>
          <div className="stat-card">
            <h3>✅ In Stock</h3>
            <p>{products.filter(p => p.stock > 0).length}</p>
          </div>
          <div className="stat-card">
            <h3>❌ Out of Stock</h3>
            <p>{products.filter(p => p.stock === 0).length}</p>
          </div>
          <div className="stat-card">
            <h3>🧵 Tapes & Wicks</h3>
            <p>{products.filter(p => p.category.includes('Tape') || p.category.includes('Wick')).length}</p>
          </div>
        </div>

        <div className="admin-actions">
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="add-product-btn"
          >
            {showAddForm ? 'Cancel' : '🧵 Add New Tape/Wick'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-product-form">
            <h3>🧵 Add New Tape/Wick Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="form-section">
                <h4>📋 Basic Information</h4>
                <div className="form-row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name (e.g., Cotton Tape 25mm)"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="brand"
                    placeholder="Brand"
                    value={newProduct.brand}
                    onChange={handleInputChange}
                    required
                    readOnly
                  />
                </div>
                <div className="form-row">
                  <input
                    type="number"
                    name="price"
                    placeholder="Price per Kg (₹)"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="number"
                    name="originalPrice"
                    placeholder="Original Price per Kg (₹)"
                    value={newProduct.originalPrice}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock Quantity"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <select
                    name="unit"
                    value={newProduct.unit}
                    onChange={handleInputChange}
                    required
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="minimumOrder"
                    placeholder="Minimum Order Quantity"
                    value={newProduct.minimumOrder}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h4>📸 Product Images</h4>
                {newProduct.images.map((image, index) => (
                  <div key={index} className="array-input">
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={image}
                      onChange={(e) => handleArrayChange(index, 'images', e.target.value)}
                      required
                    />
                    {newProduct.images.length > 1 && (
                      <button type="button" onClick={() => removeArrayField(index, 'images')}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArrayField('images')}>
                  Add Image
                </button>
              </div>

              <div className="form-section">
                <h4>📝 Description</h4>
                <textarea
                  name="description"
                  placeholder="Product Description (material, usage, quality etc.)"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>

              <div className="form-section">
                <h4>🔧 Technical Specifications</h4>
                <div className="spec-grid">
                  <input
                    type="text"
                    name="specifications.material"
                    placeholder="Material (Cotton, Polyester, etc.)"
                    value={newProduct.specifications.material}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.width"
                    placeholder="Width (mm/inches)"
                    value={newProduct.specifications.width}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.thickness"
                    placeholder="Thickness (mm)"
                    value={newProduct.specifications.thickness}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.color"
                    placeholder="Color"
                    value={newProduct.specifications.color}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.pattern"
                    placeholder="Pattern/Design"
                    value={newProduct.specifications.pattern}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.length"
                    placeholder="Length per Kg"
                    value={newProduct.specifications.length}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.weight"
                    placeholder="Weight per meter (grams)"
                    value={newProduct.specifications.weight}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.tensileStrength"
                    placeholder="Tensile Strength"
                    value={newProduct.specifications.tensileStrength}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.washable"
                    placeholder="Washable (Yes/No)"
                    value={newProduct.specifications.washable}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.shrinkage"
                    placeholder="Shrinkage %"
                    value={newProduct.specifications.shrinkage}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.gsm"
                    placeholder="GSM (Grams per sq meter)"
                    value={newProduct.specifications.gsm}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.weave"
                    placeholder="Weave Type (Plain, Twill, etc.)"
                    value={newProduct.specifications.weave}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.origin"
                    placeholder="Origin/Made in"
                    value={newProduct.specifications.origin}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-section">
                <h4>⭐ Key Features</h4>
                {newProduct.features.map((feature, index) => (
                  <div key={index} className="array-input">
                    <input
                      type="text"
                      placeholder="Feature (e.g., High tensile strength, Colorfast, etc.)"
                      value={feature}
                      onChange={(e) => handleArrayChange(index, 'features', e.target.value)}
                    />
                    {newProduct.features.length > 1 && (
                      <button type="button" onClick={() => removeArrayField(index, 'features')}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArrayField('features')}>
                  Add Feature
                </button>
              </div>

              <button type="submit" className="submit-btn">🧵 Add Product to Inventory</button>
            </form>
          </div>
        )}

        <div className="products-history">
          <h2>📦 Product Inventory ({products.length} products)</h2>
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price per {newProduct.unit}</th>
                  <th>Stock</th>
                  <th>Added Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                      No tapes or wicks added yet. Click "🧵 Add New Tape/Wick" to get started.
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img 
                          src={product.images?.[0] || 'https://via.placeholder.com/50x50?text=No+Image'} 
                          alt={product.name} 
                          className="product-thumb" 
                        />
                      </td>
                      <td>
                        <div className="product-name-cell">
                          <strong>{product.name}</strong>
                          <small>{product.description?.substring(0, 50)}...</small>
                        </div>
                      </td>
                      <td>{product.brand}</td>
                      <td>
                        <span className="category-badge">{product.category}</span>
                      </td>
                      <td>
                        <div className="price-cell">
                          <strong>{formatPrice(product.price)}</strong>
                          {product.originalPrice && (
                            <small className="original-price">
                              {formatPrice(product.originalPrice)}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {product.stock > 0 ? `${product.stock} ${product.unit || 'Kg'}` : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        {new Date(product.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <span className={`status-badge ${product.stock > 0 ? 'active' : 'inactive'}`}>
                          {product.stock > 0 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;


