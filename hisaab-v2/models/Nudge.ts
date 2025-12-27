
import mongoose from 'mongoose';

const NudgeSchema = new mongoose.Schema({
  contextType: { type: String, enum: ['group', 'direct'], required: true },
  contextId: { type: String, required: true },
  fromUser: { type: String, required: true },
  toUser: { type: String, required: true },
  messageType: { type: String, default: 'polite' },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for rate limiting lookups
NudgeSchema.index({ fromUser: 1, toUser: 1, createdAt: -1 });

export default mongoose.models.Nudge || mongoose.model('Nudge', NudgeSchema);
