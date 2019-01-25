const admin = require('firebase-admin')
if (process.env.NODE_ENV !== 'production') require('../../secrets')

// Initialize database with global variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.project_id,
    clientEmail: process.env.client_email,
    privateKey: process.env.private_key.replace(/\\n/g, '\n')
  }),
  databaseURL: 'https://guava-stackbox.firebaseio.com'
})

// Back-end firebase is admin.database()
const database = admin.database()

module.exports = database
