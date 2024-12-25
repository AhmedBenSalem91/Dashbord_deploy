const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, default: 'username', unique: true },
  password: { type: String, required: true, default: 'password' },
  email: { type: String, required: true, unique: true }, 
  role: { type: String, required: true, default: 'client' },
  registrationToken: { type: String },
  profile: {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    avatar: { type: String, default: '' },
  }
});

// Hash the password before saving the user model
userSchema.pre('save', async function(next) {
  // Hash the password if it's modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Set profile firstName and profile email defaults if they are not provided
  if (!this.profile.firstName) {
    this.profile.firstName = this.username;  // Default profile firstName to username
  }

  if (!this.profile.email) {
    this.profile.email = this.email;  // Default profile email to user's email
  }

  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Method to generate token (could be implemented in the login logic)
userSchema.methods.generateAuthToken = function(jwt, secret) {
  const token = jwt.sign({ _id: this._id, role: this.role }, secret, {
    expiresIn: '2h' // Customize the expiration
  });
  this.token = token; // Store the token in the user's record
  return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
