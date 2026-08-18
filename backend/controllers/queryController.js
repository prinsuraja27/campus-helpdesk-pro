const { v4: uuidv4 } = require('uuid');
const Query = require('../models/Query');
const Student = require('../models/Student');
const Professor = require('../models/Professor');
const sendEmail = require('../utils/emailService');
const sendSMS = require('../utils/smsService');

module.exports = {
  async submitQuery(req, res) {
    try {
      const { studentId, subject, description } = req.body;
      const ticket_id = 'TCKT-' + uuidv4().split('-')[0].toUpperCase();
      const qid = await Query.create({ ticket_id, student_id: studentId, subject, description });

      const student = await Student.findById(studentId);
      if (student) {
        const message = `Your query has been submitted. Ticket ID: ${ticket_id}. Subject: ${subject}`;
        if (student.email) {
          await sendEmail(student.email, 'Campus Help Desk Ticket Created', message).catch(()=>{});
        }
        if (student.phone) {
          await sendSMS(student.phone, message).catch(()=>{});
        }
      }

      res.json({ message: 'Query submitted', ticket_id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getStudentQueries(req, res) {
    try {
      const studentId = req.params.studentId;
      const rows = await Query.findByStudent(studentId);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async assignToProfessor(req, res) {
    try {
      const { queryId, professorId } = req.body;
      await Query.updateStatus(queryId, 'In Progress', professorId, null);
      // notify professor
      const prof = await Professor.findById(professorId);
      const q = await Query.findById(queryId);
      if (prof && prof.email) {
        const message = `A ticket ${q.ticket_id} has been assigned to you. Subject: ${q.subject}`;
        await sendEmail(prof.email, 'New Assigned Ticket', message).catch(()=>{});
      }
      res.json({ message: 'Assigned to professor' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async forwardToDepartment(req, res) {
    try {
      const { queryId, departmentId } = req.body;
      await Query.updateStatus(queryId, 'Forwarded', null, departmentId);
      res.json({ message: 'Query forwarded to department' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async resolveQuery(req, res) {
    try {
      const { queryId } = req.body;
      await Query.updateStatus(queryId, 'Resolved', null, null);
      const q = await Query.findById(queryId);
      const student = await Student.findById(q.student_id);
      const message = `Your ticket ${q.ticket_id} has been resolved.`;
      if (student && student.email) await sendEmail(student.email, 'Ticket Resolved', message).catch(()=>{});
      if (student && student.phone) await sendSMS(student.phone, message).catch(()=>{});
      res.json({ message: 'Query resolved' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async allQueries(req, res) {
    try {
      const rows = await Query.all();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
