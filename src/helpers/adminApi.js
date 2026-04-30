import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL

export const getToken = () => localStorage.getItem('admin_token')
export const setToken = (token) => localStorage.setItem('admin_token', token)
export const removeToken = () => localStorage.removeItem('admin_token')
export const isAuthenticated = () => !!getToken()

const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } })

export const login = (username, password) =>
  axios.post(`${BASE_URL}/auth/login`, { username, password })

export const getProjects = () => axios.get(`${BASE_URL}/projects/all`, authHeaders())

export const toggleActive = (id, isActive) =>
  axios.put(`${BASE_URL}/projects/${id}`, { isActive }, authHeaders())

export const createProject = (data) =>
  axios.post(`${BASE_URL}/projects`, data, authHeaders())

export const updateProject = (id, data) =>
  axios.put(`${BASE_URL}/projects/${id}`, data, authHeaders())

export const deleteProject = (id) =>
  axios.delete(`${BASE_URL}/projects/${id}`, authHeaders())

export const uploadImages = (files) => {
  const fd = new FormData()
  files.forEach(f => fd.append('images', f))
  return axios.post(`${BASE_URL}/upload`, fd, authHeaders())
}

export const toggleFeatured = (id, featured) =>
  axios.put(`${BASE_URL}/projects/${id}`, { featured }, authHeaders())
