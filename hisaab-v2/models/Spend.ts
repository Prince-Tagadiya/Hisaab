
import mongoose from 'mongoose';

const SpendSchema = new mongoose.Schema({
  contextType: { type: String, enum: ['group', 'direct'], required: true },
  contextId: { type: String, required: true }, // GroupID or DirectSplitID
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: String, required: true }, // UserID
  
  // Participants involved in the split
  participants: [{ type: String }], // List of UserIDs
  
  // Who created this record
  userId: { type: String, required: true }, 

  // Split Logic
  shareAmount: { type: Number }, // If stored per person, or total? "shareAmount" usually means per person if equal? Or total? 
  // User spec: "shareAmount" in singular. Likely implies simple equal split per person or reference. 
  // More robust: Map of user -> amount. But keeping to spec fields.
  
  splitType: { type: String, enum: ['equal', 'custom', 'percentage', 'shares'], default: 'equal' },
  note: String,
  status: { type: String, enum: ['pending', 'cleared'], default: 'pending' },
  
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  lockedAt: { type: Date } // For edit window expiration
});

// Indexes
SpendSchema.index({ contextId: 1, createdAt: -1 }); // Fast history fetch
SpendSchema.index({ paidBy: 1 });

export default mongoose.models.Spend || mongoose.model('Spend', SpendSchema);
