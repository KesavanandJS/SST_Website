const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/placements', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

// Create admin account
async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword
    });
    
    await admin.save();
    console.log('Admin account created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    mongoose.connection.close();
  } catch (error) {
    if (error.code === 11000) {
      console.log('Admin account already exists!');
    } else {
      console.error('Error creating admin:', error);
    }
    mongoose.connection.close();
  }
}

createAdmin();
