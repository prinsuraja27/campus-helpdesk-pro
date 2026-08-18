const bcrypt = require('bcryptjs');
const db = require('./config/db');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Admin name: ', (name) => {
  rl.question('Admin email: ', (email) => {
    rl.question('Password: ', async (password) => {
      const hashed = await bcrypt.hash(password, 10);
      try {
        const [result] = await db.execute('INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, 'superadmin']);
        console.log('Superadmin created with id', result.insertId);
      } catch (err) {
        console.error('Error:', err.message);
      } finally {
        rl.close();
        process.exit(0);
      }
    });
  });
});
