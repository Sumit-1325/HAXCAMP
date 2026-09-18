import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import { ADMIN_ROLES } from '../constants/index.js';

const SALT_ROUNDS = 10;

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Admin name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Admin password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ADMIN_ROLES,
        message: `Role must be one of: ${ADMIN_ROLES.join(', ')}`,
      },
      default: 'admin',
    },
  },
  { timestamps: true },
);

adminSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

adminSchema.methods.matchPassword = function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

adminSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export const Admin = mongoose.model('Admin', adminSchema);
