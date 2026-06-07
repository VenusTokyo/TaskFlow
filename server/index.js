require('dotenv').config()
require('./db')

const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/tasks', require('./routes/tasks'))

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`TaskFlow server running on http://localhost:${PORT}`))
