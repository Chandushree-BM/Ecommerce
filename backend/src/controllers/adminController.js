import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const sign = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await User.findOne({ email, role: 'admin' });
  if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  const token = sign({ id: admin._id, role: 'admin' });
  res.json({ token, user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
};

export const adminProfile = async (req, res) => {
  const admin = await User.findById(req.user.id).select('-password');
  res.json(admin);
};