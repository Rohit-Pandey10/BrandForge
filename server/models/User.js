import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Only @gmail.com addresses are permitted']
  },
  password: { type: String }, // Hashed with bcrypt; optional if Google auth
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String },
  displayName: { type: String },
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models?.User || mongoose.model('User', userSchema);
