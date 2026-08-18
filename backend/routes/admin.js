const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All routes protected: only admin or superadmin
router.use(authenticateToken);
router.use(requireRole('admin'));

router.post('/create-admin', adminController.createAdmin);
router.get('/admins', adminController.listAdmins);
router.post('/create-professor', adminController.createProfessor);
router.post('/create-student', adminController.createStudent);
router.post('/create-department', adminController.createDepartment);
router.get('/all-users', adminController.listAllUsers);
router.post('/reset-password', adminController.resetUserPassword);

module.exports = router;
