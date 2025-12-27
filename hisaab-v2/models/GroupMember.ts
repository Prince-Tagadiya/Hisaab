
import mongoose from 'mongoose';

const GroupMemberSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  userId: { type: String, required: true }, // Firebase UID or User _id string mapping
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  familyLabel: { type: String }, // Optional, e.g. "Patel Family"
  isCleared: { type: Boolean, default: true }, // Starts cleared until spend
  joinedAt: { type: Date, default: Date.now }
});

// Compound Index: One document per user per group
GroupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

export default mongoose.models.GroupMember || mongoose.model('GroupMember', GroupMemberSchema);
