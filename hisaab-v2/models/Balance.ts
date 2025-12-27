
import mongoose from 'mongoose';

const BalanceSchema = new mongoose.Schema({
  contextType: { type: String, enum: ['group', 'direct'], required: true },
  contextId: { type: String, required: true },
  userId: { type: String, required: true },
  toPay: { type: Number, default: 0, min: 0 },
  toReceive: { type: Number, default: 0, min: 0 },
  lastUpdatedAt: { type: Date, default: Date.now }
});

// Indexes for fast lookup
BalanceSchema.index({ contextId: 1, userId: 1 }, { unique: true });
BalanceSchema.index({ userId: 1 }); // "Get my total balance"

export default mongoose.models.Balance || mongoose.model('Balance', BalanceSchema);
