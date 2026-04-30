import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ProjectDetail from './ProjectDetail'

function ApiProjectDetail({ match }) {
  const slug = match.params.slug
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/projects/${slug}`)
      .then(res => {
        setProject(res.data)
        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Lato, sans-serif', letterSpacing: '2px', fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>
      Loading...
    </div>
  )

  if (notFound || !project) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Lato, sans-serif', letterSpacing: '2px', fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>
      Project not found.
    </div>
  )

  return <ProjectDetail project={project} />
}

export default ApiProjectDetail
