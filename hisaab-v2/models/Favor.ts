
import mongoose from 'mongoose';

const FavorSchema = new mongoose.Schema({
  contextType: { type: String, enum: ['group', 'direct'], required: true },
  contextId: { type: String, required: true },
  userId: { type: String, required: true },
  count: { type: Number, default: 0, min: 0 },
  lastUpdatedAt: { type: Date, default: Date.now }
});

// Indexes
FavorSchema.index({ contextId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Favor || mongoose.model('Favor', FavorSchema);
