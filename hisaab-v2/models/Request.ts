
import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  type: { type: String, enum: ['friend', 'group_invite'], required: true },
  
  // From User (Snapshot for faster list display)
  fromUser: { 
    userId: { type: String, required: true },
    name: String,
    email: String,
    photoURL: String 
  },

  // To User
  toUser: {
    userId: String,
    email: String
  },

  // For Group Invites
  groupId: String,
  groupName: String,
  
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Compound index to quickly find my pending requests
RequestSchema.index({ 'toUser.userId': 1, status: 1 });
RequestSchema.index({ 'toUser.email': 1, status: 1 });

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);
