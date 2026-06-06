const router = require('express').Router()
const auth = require('../middleware/auth')
const db = require('../db')
const { randomUUID } = require('crypto')

router.get('/', auth, (req, res) => {
  const projects = db.prepare(`
    SELECT p.*, COUNT(t.id) as task_count
    FROM projects p
    LEFT JOIN tasks t ON t.project_id = p.id
    WHERE p.user_id = ?
    GROUP BY p.id
    ORDER BY p.updated_at DESC
  `).all(req.user.id)
  res.json(projects)
})

router.get('/:id', auth, (req, res) => {
  const project = db.prepare(`
    SELECT p.*, COUNT(t.id) as task_count
    FROM projects p
    LEFT JOIN tasks t ON t.project_id = p.id
    WHERE p.id = ? AND p.user_id = ?
    GROUP BY p.id
  `).get(req.params.id, req.user.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })
  res.json(project)
})

router.post('/', auth, (req, res) => {
  const { title, description } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })
  const id = randomUUID()
  db.prepare('INSERT INTO projects (id, title, description, user_id) VALUES (?, ?, ?, ?)').run(
    id, title, description || null, req.user.id
  )
  const project = db.prepare('SELECT *, 0 as task_count FROM projects WHERE id = ?').get(id)
  res.json(project)
})

router.put('/:id', auth, (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const { title, description, status } = req.body
  db.prepare(`
    UPDATE projects SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(
    title ?? project.title,
    description !== undefined ? description : project.description,
    status ?? project.status,
    req.params.id
  )
  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id)
  res.json(updated)
})

router.delete('/:id', auth, (req, res) => {
  const project = db.prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id)
  if (!project) return res.status(404).json({ error: 'Project not found' })
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

module.exports = router
