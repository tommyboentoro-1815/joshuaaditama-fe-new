import React, { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  toggleFeatured,
  toggleActive,
  removeToken,
  getStats,
} from '../../helpers/adminApi'
import ProjectForm from './ProjectForm'
import '../../Supports/admin.css'

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / 1024).toFixed(0) + ' KB'
}

function StorageBar({ label, used, limit, limitLabel }) {
  const pct = Math.min((used / limit) * 100, 100)
  const color = pct > 85 ? '#e55' : pct > 60 ? '#e9a23b' : '#2a9d2a'
  return (
    <div className="admin-storage-bar">
      <div className="admin-storage-bar__header">
        <span className="admin-storage-bar__label">{label}</span>
        <span className="admin-storage-bar__values">{formatBytes(used)} / {limitLabel}</span>
      </div>
      <div className="admin-storage-bar__track">
        <div className="admin-storage-bar__fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="admin-storage-bar__pct">{pct.toFixed(1)}% used</div>
    </div>
  )
}

function Dashboard() {
  const history = useHistory()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [featureLoading, setFeatureLoading] = useState(null)
  const [activeLoading, setActiveLoading] = useState(null)
  const [stats, setStats] = useState(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getProjects()
      setProjects(res.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
    getStats().then(res => setStats(res.data)).catch(() => {})
  }, [fetchProjects])

  const handleLogout = () => {
    removeToken()
    history.push('/admin')
  }

  const openAdd = () => {
    setEditingProject(null)
    setShowForm(true)
  }

  const openEdit = (project) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleFormSubmit = async (payload) => {
    if (editingProject) {
      await updateProject(editingProject._id, payload)
    } else {
      await createProject(payload)
    }
    setShowForm(false)
    setEditingProject(null)
    fetchProjects()
  }

  const handleDelete = async (project) => {
    if (deleteConfirm !== project._id) {
      setDeleteConfirm(project._id)
      return
    }
    try {
      await deleteProject(project._id)
      setDeleteConfirm(null)
      fetchProjects()
    } catch {
      setDeleteConfirm(null)
    }
  }

  const handleToggleFeatured = async (project) => {
    setFeatureLoading(project._id)
    try {
      await toggleFeatured(project._id, !project.featured)
      setProjects(prev =>
        prev.map(p => p._id === project._id ? { ...p, featured: !p.featured } : p)
      )
    } catch {
      // silent
    } finally {
      setFeatureLoading(null)
    }
  }

  const handleToggleActive = async (project) => {
    setActiveLoading(project._id)
    try {
      await toggleActive(project._id, !project.isActive)
      setProjects(prev =>
        prev.map(p => p._id === project._id ? { ...p, isActive: !p.isActive } : p)
      )
    } catch {
      // silent
    } finally {
      setActiveLoading(null)
    }
  }

  const featuredCount = projects.filter(p => p.featured).length

  return (
    <div className="admin-page">
      {/* Top Bar */}
      <div className="admin-topbar">
        <div className="admin-topbar__title">Joshua Aditama — Admin</div>
        <button className="admin-topbar__logout" onClick={handleLogout}>Logout</button>
      </div>

      {/* Storage Stats */}
      {stats && (
        <div className="admin-stats">
          <StorageBar
            label="MongoDB"
            used={stats.mongodb.usedBytes}
            limit={stats.mongodb.limitBytes}
            limitLabel="512 MB (Atlas Free)"
          />
          <StorageBar
            label="Cloudinary"
            used={stats.cloudinary.usedBytes}
            limit={stats.cloudinary.limitBytes}
            limitLabel="25 GB (Free)"
          />
        </div>
      )}

      {/* Body */}
      <div className="admin-body">
        <div className="admin-section-header">
          <div>
            <div className="admin-section-title">Projects ({projects.length})</div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px', letterSpacing: '0.5px' }}>
              ★ Featured on homepage: {featuredCount} / 3 recommended
            </div>
          </div>
          <button className="btn-admin" onClick={openAdd}>+ Add Project</button>
        </div>

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="admin-empty">No projects yet. Click "Add Project" to get started.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Year</th>
                <th>Status</th>
                <th>Status</th>
                <th>Homepage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p._id}>
                  <td>
                    {p.images?.[0] && (
                      <img src={p.images[0]} alt={p.title} className="admin-table__thumb" />
                    )}
                  </td>
                  <td><strong>{p.title}</strong></td>
                  <td>{p.category}</td>
                  <td>{p.location}</td>
                  <td>{p.year}</td>
                  <td><span className="admin-badge">{p.status}</span></td>
                  <td>
                    <button
                      onClick={() => handleToggleActive(p)}
                      disabled={activeLoading === p._id}
                      title={p.isActive !== false ? 'Set to Draft' : 'Set to Active'}
                      style={{
                        padding: '4px 10px',
                        fontSize: '10px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        border: `1px solid ${p.isActive !== false ? '#2a9d2a' : '#bbb'}`,
                        color: p.isActive !== false ? '#2a9d2a' : '#999',
                        background: 'none',
                        cursor: 'pointer',
                        opacity: activeLoading === p._id ? 0.4 : 1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {p.isActive !== false ? 'Active' : 'Draft'}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      disabled={featureLoading === p._id}
                      title={p.featured ? 'Remove from homepage' : 'Feature on homepage'}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        opacity: featureLoading === p._id ? 0.4 : 1,
                        filter: p.featured ? 'none' : 'grayscale(1)',
                      }}
                    >
                      {p.featured ? '★' : '☆'}
                    </button>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        className="btn-admin btn-admin--outline btn-admin--sm"
                        onClick={() => openEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className={`btn-admin btn-admin--sm ${deleteConfirm === p._id ? 'btn-admin--danger' : 'btn-admin--outline'}`}
                        onClick={() => handleDelete(p)}
                        title={deleteConfirm === p._id ? 'Click again to confirm' : 'Delete'}
                      >
                        {deleteConfirm === p._id ? 'Confirm?' : 'Delete'}
                      </button>
                      {deleteConfirm === p._id && (
                        <button
                          className="btn-admin btn-admin--outline btn-admin--sm"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm
          project={editingProject}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingProject(null) }}
        />
      )}
    </div>
  )
}

export default Dashboard
