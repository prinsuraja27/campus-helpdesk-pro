const db = require('../config/db');

const QueryModel = {
  async create({ ticket_id, student_id, subject, description, assigned_professor_id = null, assigned_department_id = null }) {
    const [result] = await db.execute(
      'INSERT INTO queries (ticket_id, student_id, subject, description, assigned_professor_id, assigned_department_id) VALUES (?, ?, ?, ?, ?, ?)',
      [ticket_id, student_id, subject, description, assigned_professor_id, assigned_department_id]
    );
    return result.insertId;
  },

  async findByTicket(ticket_id) {
    const [rows] = await db.execute('SELECT * FROM queries WHERE ticket_id = ?', [ticket_id]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM queries WHERE id = ?', [id]);
    return rows[0];
  },

  async findByStudent(student_id) {
    const [rows] = await db.execute('SELECT * FROM queries WHERE student_id = ? ORDER BY created_at DESC', [student_id]);
    return rows;
  },

  async updateStatus(id, status, assigned_professor_id = null, assigned_department_id = null) {
    const [result] = await db.execute(
      'UPDATE queries SET status = ?, assigned_professor_id = ?, assigned_department_id = ? WHERE id = ?',
      [status, assigned_professor_id, assigned_department_id, id]
    );
    return result.affectedRows;
  },

  async all() {
    const [rows] = await db.execute('SELECT * FROM queries ORDER BY created_at DESC');
    return rows;
  }
};

module.exports = QueryModel;
