import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ admin, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    images: [''],
    category: 'Smartphones',
    description: '',
    specifications: {
      processor: '',
      ram: '',
      storage: '',
      display: '',
      battery: '',
      camera: '',
      os: '',
      connectivity: '',
      dimensions: '',
      weight: '',
      warranty: '',
      color: ''
    },
    features: [''],
    stock: ''
  });

  const categories = ['Smartphones', 'Laptops', 'Audio', 'Tablets', 'Gaming', 'Accessories', 'Smart Watches', 'Cameras'];

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
      brand: '',
      price: '',
      originalPrice: '',
      images: [''],
      category: 'Smartphones',
      description: '',
      specifications: {
        processor: '',
        ram: '',
        storage: '',
        display: '',
        battery: '',
        camera: '',
        os: '',
        connectivity: '',
        dimensions: '',
        weight: '',
        warranty: '',
        color: ''
      },
      features: [''],
      stock: ''
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
        <h1>Admin Dashboard</h1>
        <div className="admin-nav">
          <span>Welcome, {admin?.username || 'Admin'}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="admin-main">
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>
          <div className="stat-card">
            <h3>In Stock</h3>
            <p>{products.filter(p => p.stock > 0).length}</p>
          </div>
          <div className="stat-card">
            <h3>Out of Stock</h3>
            <p>{products.filter(p => p.stock === 0).length}</p>
          </div>
        </div>

        <div className="admin-actions">
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="add-product-btn"
          >
            {showAddForm ? 'Cancel' : 'Add New Product'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-product-form">
            <h3>Add New Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="form-section">
                <h4>Basic Information</h4>
                <div className="form-row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
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
                  />
                </div>
                <div className="form-row">
                  <input
                    type="number"
                    name="price"
                    placeholder="Selling Price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="number"
                    name="originalPrice"
                    placeholder="Original Price"
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
              </div>

              <div className="form-section">
                <h4>Product Images</h4>
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
                <h4>Description</h4>
                <textarea
                  name="description"
                  placeholder="Product Description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>

              <div className="form-section">
                <h4>Specifications</h4>
                <div className="spec-grid">
                  <input
                    type="text"
                    name="specifications.processor"
                    placeholder="Processor"
                    value={newProduct.specifications.processor}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.ram"
                    placeholder="RAM"
                    value={newProduct.specifications.ram}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.storage"
                    placeholder="Storage"
                    value={newProduct.specifications.storage}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.display"
                    placeholder="Display"
                    value={newProduct.specifications.display}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.battery"
                    placeholder="Battery"
                    value={newProduct.specifications.battery}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="specifications.camera"
                    placeholder="Camera"
                    value={newProduct.specifications.camera}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-section">
                <h4>Key Features</h4>
                {newProduct.features.map((feature, index) => (
                  <div key={index} className="array-input">
                    <input
                      type="text"
                      placeholder="Feature"
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

              <button type="submit" className="submit-btn">Add Product</button>
            </form>
          </div>
        )}

        <div className="products-history">
          <h2>Product History ({products.length} products)</h2>
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Added Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                      No products added yet. Click "Add New Product" to get started.
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
                          {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
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


