import React, { useState, useEffect } from 'react'
import { uploadImages } from '../../helpers/adminApi'

const STATUS_OPTIONS = ['Completed', 'Under Construction', 'Design Proposal', 'Proposal']

const toSlug = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '').replace(/\s+/g, '')

const emptyForm = {
  title: '',
  slug: '',
  category: '',
  location: '',
  year: '',
  status: 'Design Proposal',
  headingDescription: '',
  bodyParagraphs: [''],
  bodyDescriptionTwo: [],
  images: [],
}

function ProjectForm({ project, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm)
  const [newFiles, setNewFiles] = useState([])
  const [newFilePreviews, setNewFilePreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || '',
        slug: project.slug || '',
        category: project.category || '',
        location: project.location || '',
        year: project.year || '',
        status: project.status || 'Design Proposal',
        headingDescription: project.headingDescription || '',
        bodyParagraphs: project.bodyParagraphs?.length ? project.bodyParagraphs : [''],
        bodyDescriptionTwo: project.bodyDescriptionTwo || [],
        images: project.images || [],
      })
    } else {
      setForm(emptyForm)
    }
    setNewFiles([])
    setNewFilePreviews([])
    setError('')
  }, [project])

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleTitleChange = (e) => {
    const title = e.target.value
    set('title', title)
    if (!project) set('slug', toSlug(title))
  }

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files)
    setNewFiles(prev => [...prev, ...files])
    const previews = files.map(f => URL.createObjectURL(f))
    setNewFilePreviews(prev => [...prev, ...previews])
    e.target.value = ''
  }

  const removeExistingImage = (idx) =>
    set('images', form.images.filter((_, i) => i !== idx))

  const removeNewFile = (idx) => {
    URL.revokeObjectURL(newFilePreviews[idx])
    setNewFiles(prev => prev.filter((_, i) => i !== idx))
    setNewFilePreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const updateParagraph = (arr, key, idx, val) =>
    set(key, arr.map((p, i) => i === idx ? val : p))

  const addParagraph = (key) => set(key, [...form[key], ''])

  const removeParagraph = (key, idx) =>
    set(key, form[key].filter((_, i) => i !== idx))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) return setError('Title is required')
    if (!form.slug.trim()) return setError('Slug is required')
    if (form.images.length === 0 && newFiles.length === 0)
      return setError('At least one image is required')

    setUploading(true)
    try {
      let uploadedUrls = []
      if (newFiles.length > 0) {
        const res = await uploadImages(newFiles)
        uploadedUrls = res.data.urls
      }

      const allImages = [...form.images, ...uploadedUrls]
      const bodyDescTwo = form.bodyDescriptionTwo.filter(p => p.trim())

      const payload = {
        ...form,
        images: allImages,
        bodyParagraphs: form.bodyParagraphs.filter(p => p.trim()),
        bodyDescriptionTwo: bodyDescTwo.length ? bodyDescTwo : null,
      }

      await onSubmit(payload)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <button className="admin-modal__close" onClick={onCancel} type="button">&times;</button>
        <div className="admin-modal__title">
          {project ? 'Edit Project' : 'Add New Project'}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title & Slug */}
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Title *</label>
              <input
                className="admin-form__input"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="OPENAIRE"
              />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Slug *</label>
              <input
                className="admin-form__input"
                value={form.slug}
                onChange={e => set('slug', e.target.value)}
                placeholder="openaire"
              />
            </div>
          </div>

          {/* Category & Location */}
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Category</label>
              <input
                className="admin-form__input"
                value={form.category}
                onChange={e => set('category', e.target.value)}
                placeholder="Architecture, Interior"
              />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Location</label>
              <input
                className="admin-form__input"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                placeholder="Semarang, INA"
              />
            </div>
          </div>

          {/* Year & Status */}
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Year</label>
              <input
                className="admin-form__input"
                value={form.year}
                onChange={e => set('year', e.target.value)}
                placeholder="2024"
              />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Status</label>
              <select
                className="admin-form__select"
                value={form.status}
                onChange={e => set('status', e.target.value)}
              >
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Heading Description */}
          <div className="admin-form__field">
            <label className="admin-form__label">Heading Description</label>
            <textarea
              className="admin-form__textarea"
              value={form.headingDescription}
              onChange={e => set('headingDescription', e.target.value)}
              rows={3}
              placeholder="Short description shown at the top of the project page"
            />
          </div>

          {/* Body Paragraphs */}
          <div className="admin-form__field">
            <label className="admin-form__label">Body Paragraphs</label>
            {form.bodyParagraphs.map((p, i) => (
              <div className="admin-form__dynamic-item" key={i}>
                <textarea
                  value={p}
                  onChange={e => updateParagraph(form.bodyParagraphs, 'bodyParagraphs', i, e.target.value)}
                  placeholder={`Paragraph ${i + 1}`}
                />
                {form.bodyParagraphs.length > 1 && (
                  <button
                    type="button"
                    className="admin-form__remove-btn"
                    onClick={() => removeParagraph('bodyParagraphs', i)}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="admin-form__add-btn"
              onClick={() => addParagraph('bodyParagraphs')}
            >
              + Add Paragraph
            </button>
          </div>

          {/* Body Description Two (optional) */}
          <div className="admin-form__field">
            <label className="admin-form__label">
              Second Description Block{' '}
              <span style={{ color: '#bbb', fontWeight: 400 }}>(optional)</span>
            </label>
            {form.bodyDescriptionTwo.map((p, i) => (
              <div className="admin-form__dynamic-item" key={i}>
                <textarea
                  value={p}
                  onChange={e => updateParagraph(form.bodyDescriptionTwo, 'bodyDescriptionTwo', i, e.target.value)}
                  placeholder={`Description ${i + 1}`}
                />
                <button
                  type="button"
                  className="admin-form__remove-btn"
                  onClick={() => removeParagraph('bodyDescriptionTwo', i)}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-form__add-btn"
              onClick={() => addParagraph('bodyDescriptionTwo')}
            >
              + Add Second Block
            </button>
          </div>

          {/* Images */}
          <div className="admin-form__field">
            <label className="admin-form__label">Images *</label>
            <div className="admin-images-grid">
              {form.images.map((url, i) => (
                <div className="admin-image-thumb" key={`existing-${i}`}>
                  <img src={url} alt="" />
                  <button
                    type="button"
                    className="admin-image-thumb__remove"
                    onClick={() => removeExistingImage(i)}
                  >
                    &times;
                  </button>
                </div>
              ))}
              {newFilePreviews.map((url, i) => (
                <div className="admin-image-thumb" key={`new-${i}`}>
                  <img src={url} alt="" />
                  <button
                    type="button"
                    className="admin-image-thumb__remove"
                    onClick={() => removeNewFile(i)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <label className="admin-file-label">
              + Add Images
              <input
                type="file"
                className="admin-file-input"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
              />
            </label>
          </div>

          {error && <div className="admin-form__error">{error}</div>}

          <div className="admin-form__footer">
            <button
              type="button"
              className="btn-admin btn-admin--outline"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-admin"
              disabled={uploading}
            >
              {uploading ? 'Saving...' : project ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectForm
