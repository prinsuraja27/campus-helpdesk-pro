const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Professor = require('../models/Professor');
const Admin = require('../models/Admin');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

module.exports = {
  async studentRegister(req, res) {
    try {
      const { student_id, name, email, phone, password } = req.body;
      const existing = await Student.findByEmail(email);
      if (existing) return res.status(400).json({ message: 'Email already registered' });

      const hashed = await bcrypt.hash(password, 10);
      const id = await Student.create({ student_id, name, email, phone, password: hashed });
      res.json({ message: 'Student created', id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async studentLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await Student.findByEmail(email);
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, role: 'student', type: 'student' }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async professorLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await Professor.findByEmail(email);
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, role: 'professor', type: 'professor' }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async adminLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await Admin.findByEmail(email);
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, role: user.role || 'admin', type: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
