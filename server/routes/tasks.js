const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')
const { randomUUID } = require('crypto')

router.get('/project/:projectId', auth, (req, res) => {
  const project = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(req.params.projectId, req.user.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })
  const tasks = db.prepare('SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at ASC').all(req.params.projectId)
  res.json(tasks)
})

router.post('/', auth, (req, res) => {
  const { title, description, priority, dueDate, projectId } = req.body
  if (!title || !projectId) return res.status(400).json({ error: 'Title and projectId are required' })

  const project = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(projectId, req.user.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const id = randomUUID()
  db.prepare('INSERT INTO tasks (id, title, description, priority, due_date, project_id) VALUES (?, ?, ?, ?, ?, ?)').run(
    id, title, description || null, priority || 'medium', dueDate || null, projectId
  )
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
  res.json(task)
})

router.put('/:id', auth, (req, res) => {
  const task = db.prepare(`
    SELECT t.* FROM tasks t
    JOIN projects p ON p.id = t.project_id
    WHERE t.id = ? AND p.user_id = ?
  `).get(req.params.id, req.user.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })

  const { title, description, status, priority, dueDate } = req.body
  db.prepare(`
    UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title ?? task.title,
    description !== undefined ? description : task.description,
    status ?? task.status,
    priority ?? task.priority,
    dueDate !== undefined ? dueDate : task.due_date,
    req.params.id
  )
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)
  res.json(updated)
})

router.delete('/:id', auth, (req, res) => {
  const task = db.prepare(`
    SELECT t.id FROM tasks t
    JOIN projects p ON p.id = t.project_id
    WHERE t.id = ? AND p.user_id = ?
  `).get(req.params.id, req.user.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

module.exports = router
