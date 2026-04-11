// backend/models/User.js
const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true }, 
  password: { type: String, required: true, minlength: 6 },
  
  // Account Settings
  role: { type: String, enum: ['member', 'admin'], default: 'member' }, 
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  
  // Profile Information
  bio: { type: String, default: '' }, 
  profilePic: { type: String, default: '' },
  
  // Registration Fields
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  dob: { type: Date, required: true },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other', 'prefer-not-to-say'], 
    required: true 
  },
  accountType: { 
    type: String, 
    enum: ['fan', 'athlete', 'coach', 'premium'], 
    required: true 
  },
  experience: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'fan'], 
    required: true 
  },
  sports: [{ 
    type: String, 
    enum: ['basketball', 'volleyball', 'tennis', 'swimming', 'running', 'martial-arts']
  }],
  
  // NEW: Security Questions for Password Reset
  securityQuestion: { type: String, default: '' },
  securityAnswer: { type: String, default: '' }, // Will be hashed
  
  // For password reset (keeping for compatibility, but not using email)
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  
}, { timestamps: true });

// Pre-save hook: hash password before storing
userSchema.pre('save', async function () { 
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
});

// Hash security answer before saving
userSchema.pre('save', async function () {
  if (this.isModified('securityAnswer') && this.securityAnswer) {
    this.securityAnswer = await bcrypt.hash(this.securityAnswer, 10);
  }
});

// Instance method: compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) { 
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method: compare security answer
userSchema.methods.matchSecurityAnswer = async function (enteredAnswer) {
  return await bcrypt.compare(enteredAnswer, this.securityAnswer);
};



module.exports = mongoose.model('User', userSchema);