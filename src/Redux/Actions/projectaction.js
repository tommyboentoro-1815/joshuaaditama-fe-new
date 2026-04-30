import axios from "axios"

const BASE_URL = process.env.REACT_APP_API_URL

export const onAddData = (fd) => {
  return (dispatch) => {
    dispatch({ type: 'LOADING' })
    axios.post(`${BASE_URL}/data-system/upload-image`, fd)
      .then((res) => {
        dispatch({ type: 'ADD_SUCCESS', payload: res.data.message })
      })
      .catch((err) => {
        console.log(err)
        dispatch({ type: 'ADD_ERROR', payload: err.res.data.message })
      })
  }
}

export const onDelete = (id) => {
  return (dispatch) => {
    dispatch({ type: 'LOADING' })
    axios.delete(`${BASE_URL}/data-system/delete-product/` + id)
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

export const onGetData = () => {
  return (dispatch) => {
    axios.get(`${BASE_URL}/data-system/get-product`)
      .then((res) => {
        try {
          dispatch({ type: 'GET_SUCCESS', payload: res.data.detail })
        } catch (error) {
          console.log(error)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

export const onGetDetailProject = (idProduct) => {
  return (dispatch) => {
    dispatch({ type: 'LOADING' })
    axios.get(`${BASE_URL}/data-system/project-detail/${idProduct}`)
      .then((res) => {
        try {
          dispatch({ type: 'GETDETAIL_SUCCESS', payload: res.data.detail })
        } catch (error) {
          console.log(error)
        }
      })
      .catch((err) => {
        console.log(err)
        dispatch({ type: 'GET_ERROR', payload: err.res.data.message })
      })
  }
}
