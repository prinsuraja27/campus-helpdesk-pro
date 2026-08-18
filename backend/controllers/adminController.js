const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Professor = require('../models/Professor');
const Student = require('../models/Student');
const db = require('../config/db');

module.exports = {
  async createAdmin(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const existing = await Admin.findByEmail(email);
      if (existing) return res.status(400).json({ message: 'Admin email already exists' });
      const hashed = await bcrypt.hash(password, 10);
      const id = await Admin.create({ name, email, password: hashed, role: role || 'admin' });
      res.json({ message: 'Admin created', id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async listAdmins(req, res) {
    try {
      const rows = await Admin.all();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createProfessor(req, res) {
    try {
      const { name, email, password, department_id } = req.body;
      const existing = await Professor.findByEmail(email);
      if (existing) return res.status(400).json({ message: 'Professor email exists' });
      const hashed = await bcrypt.hash(password, 10);
      const id = await Professor.create({ name, email, password: hashed, department_id });
      res.json({ message: 'Professor created', id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createStudent(req, res) {
    try {
      const { student_id, name, email, phone, password } = req.body;
      const existing = await Student.findByEmail(email);
      if (existing) return res.status(400).json({ message: 'Student email exists' });
      const hashed = await bcrypt.hash(password, 10);
      const id = await Student.create({ student_id, name, email, phone, password: hashed });
      res.json({ message: 'Student created', id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createDepartment(req, res) {
    try {
      const { name, email, phone } = req.body;
      const [result] = await db.execute('INSERT INTO departments (name, email, phone) VALUES (?, ?, ?)', [name, email, phone]);
      res.json({ message: 'Department created', id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async listAllUsers(req, res) {
    try {
      const [students] = await db.execute('SELECT id, student_id, name, email, phone, created_at FROM students');
      const [professors] = await db.execute('SELECT id, name, email, department_id, created_at FROM professors');
      const [admins] = await db.execute('SELECT id, name, email, role, created_at FROM admins');
      res.json({ students, professors, admins });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async resetUserPassword(req, res) {
    try {
      const { userType, userId, newPassword } = req.body;
      const hashed = await bcrypt.hash(newPassword, 10);
      if (userType === 'student') {
        await db.execute('UPDATE students SET password = ? WHERE id = ?', [hashed, userId]);
      } else if (userType === 'professor') {
        await db.execute('UPDATE professors SET password = ? WHERE id = ?', [hashed, userId]);
      } else if (userType === 'admin') {
        await db.execute('UPDATE admins SET password = ? WHERE id = ?', [hashed, userId]);
      } else {
        return res.status(400).json({ message: 'Invalid userType' });
      }
      res.json({ message: 'Password reset successful' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
