import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const yrvSchema = new mongoose.Schema({
  videoId: { type: String, unique: true, required: true },
  start: { type: Number, trim: true, default: 0 },
  end: { type: Number, trim: true, default: null },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  reports: { type: Number, default: 0 },
  updated: { type: Date, default: Date.now() },
  created: { type: Date, default: Date.now() },
  creator: { type: String }
});

const YRV = mongoose.model('YRV', yrvSchema);

export default YRV;
