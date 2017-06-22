import axios from 'axios';

const saveCanvasAsImg = (image, id)  => {
  return dispatch => {
    return axios.post("http://localhost:8080/api/save-image", {
      image,
      id
    })
    .then((response)=>{
      console.log(response)
    })
    .catch((err)=>{
      console.log(err);
    })
  }
};

const getCanvasInfo = id => {
  return dispatch => {
    return axios.get(`http://localhost:8080/api/canvas/${id}`)
    .then((response)=>{
      return response;
    })
    .catch((err)=>{
      console.log(err);
    })
  }
}

const createNewCanvas = token => {
  return dispatch => {
    return axios.post("http://localhost:8080/api/new-canvas", {
      token
    })
    .then((response)=>{
      return response;
    })
    .catch((err)=>{
      console.log(err);
    })
  }
}

const getAllCanvasByUser = token => {
  return dispatch =>{
    return axios.get(`http://localhost:8080/api/user-canvas/${token}`)
    .then((response)=>{
       dispatch({
        type: "LOAD_USER_CANVAS",
        canvas: response.data.canvas
      })
    })
    .catch((err)=>{
      console.log(err)
    })
  }
}

export { saveCanvasAsImg, getCanvasInfo, createNewCanvas, getAllCanvasByUser };