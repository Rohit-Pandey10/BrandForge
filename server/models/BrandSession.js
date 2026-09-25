import mongoose from 'mongoose';

const brandSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  brandName: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    trim: true
  },
  initialPitch: {
    type: String,
    trim: true
  },
  domain: {
    type: String,
    default: 'general'
  },
  brandKit: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export default mongoose.models?.BrandSession || mongoose.model('BrandSession', brandSessionSchema);
