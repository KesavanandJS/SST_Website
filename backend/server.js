const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = parseInt(process.env.PORT) || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/placements', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  cart: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  wishlist: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  compare: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Enhanced Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['Smartphones', 'Laptops', 'Audio', 'Tablets', 'Gaming', 'Accessories', 'Smart Watches', 'Cameras']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  specifications: {
    processor: String,
    ram: String,
    storage: String,
    display: String,
    battery: String,
    camera: String,
    os: String,
    connectivity: String,
    dimensions: String,
    weight: String,
    warranty: String,
    color: String
  },
  features: [String],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'cod'],
    default: 'cod'
  },
  couponCode: String,
  discount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  }
});

const Admin = mongoose.model('Admin', adminSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to verify admin role
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// User Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { username, firstName, lastName, email, password, role = 'user' } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
});

// User Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Admin Routes

// Admin login route
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { adminId: admin._id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Enhanced Add Product Route
app.post('/api/admin/products', async (req, res) => {
  try {
    const {
      name, brand, price, originalPrice, images, category, description,
      specifications, features, stock
    } = req.body;

    const newProduct = new Product({
      name,
      brand,
      price,
      originalPrice,
      images,
      category,
      description,
      specifications,
      features,
      stock
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding product'
    });
  }
});

// Get All Products for Users
app.get('/api/products', async (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      sortBy, 
      isNew, 
      inStock 
    } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by new products
    if (isNew === 'true') {
      query.isNew = true;
    }

    // Filter by stock
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    let products = await Product.find(query);

    // Sort products
    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          products = products.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          products = products.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          products = products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          products = products.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          products = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }
    }

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
});

// Search products
app.get('/api/products/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    });
    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products'
    });
  }
});

// Filter products
app.post('/api/products/filter', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, brand, rating } = req.body;
    let filter = { isActive: true };

    if (category && category !== 'All') filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: minPrice };
    if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (rating) filter.rating = { $gte: rating };

    const products = await Product.find(filter);
    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error filtering products'
    });
  }
});

// Create Order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod, couponCode, discount } = req.body;

    const newOrder = new Order({
      userId: req.user.userId,
      items,
      total,
      shippingAddress,
      paymentMethod,
      couponCode,
      discount
    });

    await newOrder.save();

    // Update stock for each item
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order'
    });
  }
});

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// Enhanced Admin Product Routes

// Update product
app.put('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product'
    });
  }
});

// Get admin dashboard stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    const outOfStock = await Product.countDocuments({ stock: 0 });
    
    const recentOrders = await Order.find()
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        outOfStock
      },
      recentOrders
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
});

// ====== CART ROUTES ======

// Get user's cart
app.get('/api/user/cart', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('cart.productId')
      .select('cart');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Filter out any cart items where the product no longer exists
    const validCartItems = user.cart.filter(item => item.productId);
    
    res.json({
      success: true,
      cart: validCartItems
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Error fetching cart' });
  }
});

// Add item to cart
app.post('/api/user/cart', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(item => 
      item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({ productId, quantity });
    }

    await user.save();

    // Return updated cart with populated product data
    const updatedUser = await User.findById(userId)
      .populate('cart.productId')
      .select('cart');

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: updatedUser.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Error adding to cart' });
  }
});

// Update cart item quantity
app.put('/api/user/cart/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.userId;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cartItemIndex = user.cart.findIndex(item => 
      item.productId.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    user.cart[cartItemIndex].quantity = quantity;
    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('cart.productId')
      .select('cart');

    res.json({
      success: true,
      message: 'Cart updated',
      cart: updatedUser.cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Error updating cart' });
  }
});

// Remove item from cart
app.delete('/api/user/cart/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.cart = user.cart.filter(item => 
      item.productId.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('cart.productId')
      .select('cart');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: updatedUser.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Error removing from cart' });
  }
});

// Clear entire cart
app.delete('/api/user/cart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await User.findByIdAndUpdate(userId, { cart: [] });

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Error clearing cart' });
  }
});

// ====== WISHLIST ROUTES ======

// Get user's wishlist
app.get('/api/user/wishlist', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('wishlist.productId')
      .select('wishlist');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const validWishlistItems = user.wishlist.filter(item => item.productId);
    
    res.json({
      success: true,
      wishlist: validWishlistItems
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error fetching wishlist' });
  }
});

// Add item to wishlist
app.post('/api/user/wishlist', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if item already exists in wishlist
    const existingItem = user.wishlist.find(item => 
      item.productId.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ success: false, message: 'Item already in wishlist' });
    }

    user.wishlist.push({ productId });
    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('wishlist.productId')
      .select('wishlist');

    res.json({
      success: true,
      message: 'Item added to wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error adding to wishlist' });
  }
});

// Remove item from wishlist
app.delete('/api/user/wishlist/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(item => 
      item.productId.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('wishlist.productId')
      .select('wishlist');

    res.json({
      success: true,
      message: 'Item removed from wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error removing from wishlist' });
  }
});

// ====== COMPARE ROUTES ======

// Get user's compare list
app.get('/api/user/compare', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('compare.productId')
      .select('compare');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const validCompareItems = user.compare.filter(item => item.productId);
    
    res.json({
      success: true,
      compare: validCompareItems
    });
  } catch (error) {
    console.error('Get compare error:', error);
    res.status(500).json({ success: false, message: 'Error fetching compare list' });
  }
});

// Add item to compare
app.post('/api/user/compare', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if compare list is already full (max 3 items)
    if (user.compare.length >= 3) {
      return res.status(400).json({ success: false, message: 'Compare list is full. Maximum 3 items allowed.' });
    }

    // Check if item already exists in compare list
    const existingItem = user.compare.find(item => 
      item.productId.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ success: false, message: 'Item already in compare list' });
    }

    user.compare.push({ productId });
    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('compare.productId')
      .select('compare');

    res.json({
      success: true,
      message: 'Item added to compare list',
      compare: updatedUser.compare
    });
  } catch (error) {
    console.error('Add to compare error:', error);
    res.status(500).json({ success: false, message: 'Error adding to compare list' });
  }
});

// Remove item from compare
app.delete('/api/user/compare/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.compare = user.compare.filter(item => 
      item.productId.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('compare.productId')
      .select('compare');

    res.json({
      success: true,
      message: 'Item removed from compare list',
      compare: updatedUser.compare
    });
  } catch (error) {
    console.error('Remove from compare error:', error);
    res.status(500).json({ success: false, message: 'Error removing from compare list' });
  }
});

// Clear entire compare list
app.delete('/api/user/compare', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await User.findByIdAndUpdate(userId, { compare: [] });

    res.json({
      success: true,
      message: 'Compare list cleared',
      compare: []
    });
  } catch (error) {
    console.error('Clear compare error:', error);
    res.status(500).json({ success: false, message: 'Error clearing compare list' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
    const fallbackServer = app.listen(PORT + 1, () => {
      console.log(`Server running on port ${PORT + 1}`);
    });
    
    fallbackServer.on('error', (fallbackErr) => {
      if (fallbackErr.code === 'EADDRINUSE') {
        console.log(`Port ${PORT + 1} is also busy, trying port ${PORT + 2}`);
        app.listen(PORT + 2, () => {
          console.log(`Server running on port ${PORT + 2}`);
        });
      }
    });
  } else {
    console.error('Server error:', err);
  }
});
