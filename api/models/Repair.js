import mongoose from 'mongoose';

const repairSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    unique: true,
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  deviceType: {
    type: String,
    required: true,
    enum: ['Console', 'Controller', 'Monitor', 'Laptop', 'PC', 'Phone', 'Tablet', 'Other']
  },
  deviceModel: {
    type: String,
    required: true,
    trim: true
  },
  issueDescription: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['received', 'diagnosing', 'repairing', 'ready', 'delivered'],
    default: 'received'
  },
  cost: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Repair = mongoose.model('Repair', repairSchema);
export default Repair;
