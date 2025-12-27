
import mongoose from 'mongoose';

const ClearSchema = new mongoose.Schema({
  contextType: { type: String, enum: ['group', 'direct'], required: true },
  contextId: { type: String, required: true },
  fromUser: { type: String, required: true },
  toUser: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['payment', 'adjustment', 'favor'], default: 'payment' },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true }
});

// Indexes
ClearSchema.index({ contextId: 1 });
ClearSchema.index({ fromUser: 1 });
ClearSchema.index({ toUser: 1 });

export default mongoose.models.Clear || mongoose.model('Clear', ClearSchema);
