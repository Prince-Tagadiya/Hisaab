
import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  currency: { type: String, default: 'USD' },
  joinCode: { type: String, unique: true, sparse: true }, // Short code for joining
  type: { type: String, enum: ['trip', 'normal'], default: 'normal', required: true },
  createdBy: { type: String, required: true }, // Firebase UID or UserId
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isClosed: { type: Boolean, default: false },
  closedAt: { type: Date, default: null }
});

// Indexes
GroupSchema.index({ createdBy: 1 });

export default mongoose.models.Group || mongoose.model('Group', GroupSchema);
