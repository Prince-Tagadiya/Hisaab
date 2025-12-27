
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }, // Optional in some flows, but user asked for it
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  photoURL: String,
  mobile: String, // Optional
  createdAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now }
});

// Indexes
UserSchema.index({ firebaseUid: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);
