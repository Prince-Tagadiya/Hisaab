
import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  contextType: { type: String, enum: ['group', 'direct'], required: true },
  contextId: { type: String, required: true },
  actionType: { 
    type: String, 
    enum: [
      'GROUP_CREATED', 
      'MEMBER_ADDED', 
      'SPEND_ADDED', 
      'SPEND_EDITED', 
      'SPEND_LOCKED', 
      'CLEAR_DONE', 
      'GROUP_CLOSED', 
      'GROUP_REOPENED', 
      'NUDGE_SENT'
    ], 
    required: true 
  },
  performedBy: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed }, // Flexible JSON for details
  createdAt: { type: Date, default: Date.now }
});

// Keys: Audit Trail Ordering
ActivityLogSchema.index({ contextId: 1, createdAt: -1 });

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
