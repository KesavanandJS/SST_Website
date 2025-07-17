import React from 'react';
import './FiltersModal.css';

const FiltersModal = ({ filters, setFilters, onClose, products }) => {
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 100000;

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      brand: '',
      rating: ''
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="filters-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Filters</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="filters-content">
          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <input
                type="number"
                placeholder={`Max Price (${maxPrice})`}
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <h4>Brand</h4>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <h4>Minimum Rating</h4>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="4">4★ & above</option>
              <option value="3">3★ & above</option>
              <option value="2">2★ & above</option>
              <option value="1">1★ & above</option>
            </select>
          </div>

          <div className="filter-actions">
            <button onClick={clearFilters} className="clear-btn">Clear All</button>
            <button onClick={onClose} className="apply-btn">Apply Filters</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;
