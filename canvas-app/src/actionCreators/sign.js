import axios from 'axios';

const createAccount = userInfo => {
  return dispatch => {
    return axios.post("http://localhost:8080/api/createUser", {
      email: userInfo.email,
      userName: userInfo.userName,
      password: userInfo.password
    })
    .then((response)=>{
      return response
    })
    .catch((err)=>{
      console.log(err);
    });
  }
}

const signIn = userInfo => {
  return dispatch => {
    return axios.post("http://localhost:8080/api/authenticate", {
      emailorusername: userInfo.emailOrUsername,
      password: userInfo.password
    })
    .then((response)=>{
      return response
    })
    .catch((err)=>{
      console.log(err);
    });
  }
}

export { createAccount, signIn };