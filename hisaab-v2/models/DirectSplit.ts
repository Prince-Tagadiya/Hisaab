
import mongoose from 'mongoose';

const DirectSplitSchema = new mongoose.Schema({
  userA: { type: String, required: true },
  userB: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isArchived: { type: Boolean, default: false }
});

// Ensure userA < userB strictly for uniqueness
DirectSplitSchema.pre('save', function(next) {
  if (this.userA > this.userB) {
    const temp = this.userA;
    this.userA = this.userB;
    this.userB = temp;
  }
  next();
});

// Unique Pair Index
DirectSplitSchema.index({ userA: 1, userB: 1 }, { unique: true });

export default mongoose.models.DirectSplit || mongoose.model('DirectSplit', DirectSplitSchema);
