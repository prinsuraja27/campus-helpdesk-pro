# Campus Help Desk

## Quick setup (local)

1. Import database:
   mysql -u root -p < database/campus_helpdesk.sql

2. Configure backend env:
   cp backend/.env.example backend/.env
   Edit backend/.env with your DB, email and Twilio credentials.

3. Install and run backend:
   cd backend
   npm install
   npm run dev

4. Create superadmin:
   node create_admin.js

5. Open in browser:
   http://localhost:5000

## Notes
- Configure SMTP (SendGrid/Mailgun/SES) and Twilio for production notifications.
- Replace demo studentId usage in frontend with real logged-in id (login returns user id).
- Do not commit .env to source control.
