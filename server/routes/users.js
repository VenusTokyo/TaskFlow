const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')

router.get('/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, name, email, bio, avatar, created_at FROM users WHERE id = ?').get(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

router.put('/me', auth, (req, res) => {
  const { name, bio } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })
  db.prepare('UPDATE users SET name = ?, bio = ? WHERE id = ?').run(name, bio || null, req.user.id)
  const user = db.prepare('SELECT id, name, email, bio, avatar, created_at FROM users WHERE id = ?').get(req.user.id)
  res.json(user)
})

router.get('/stats', auth, (req, res) => {
  const totalProjects = db.prepare(
    'SELECT COUNT(*) as count FROM projects WHERE user_id = ?'
  ).get(req.user.id).count

  const totalTasks = db.prepare(`
    SELECT COUNT(*) as count FROM tasks
    WHERE project_id IN (SELECT id FROM projects WHERE user_id = ?)
  `).get(req.user.id).count

  const completedTasks = db.prepare(`
    SELECT COUNT(*) as count FROM tasks
    WHERE status = 'done' AND project_id IN (SELECT id FROM projects WHERE user_id = ?)
  `).get(req.user.id).count

  const overdueTasks = db.prepare(`
    SELECT COUNT(*) as count FROM tasks
    WHERE due_date < date('now') AND status != 'done'
    AND project_id IN (SELECT id FROM projects WHERE user_id = ?)
  `).get(req.user.id).count

  res.json({ totalProjects, totalTasks, completedTasks, overdueTasks })
})

module.exports = router
