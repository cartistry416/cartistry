/*
    This is our http api for all things auth, which we use to 
    send authorization requests to our back-end API. Note we`re 
    using the Axios library for doing this, which is an easy to 
    use AJAX-based library. We could (and maybe should) use Fetch, 
    which is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
const baseURL = process.env.NODE_ENV !== 'development' ? 'https://cartistry-express.vercel.app/auth' : 'http://localhost:4000/auth'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /register). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const loginUser = (email, password) => {
    return api.post(`/login/`, {
        email : email,
        password : password
    })
}
export const logoutUser = () => api.get(`/logout/`)
export const registerUser = (email, password, passwordVerify, userName) => {
    return api.post(`/register/`, {
        email : email,
        password : password,
        passwordVerify : passwordVerify,
        userName,
    })
}
export const resetPassword = (newPassword, confirmPassword) => {
    return api.post('/resetPassword/', {
        newPassword : newPassword,
        confirmPassword : confirmPassword
    })
}
export const requestPasswordToken = (email) => {
  return api.post('/requestPasswordToken/', {
    email
  })
}
export const verifyToken = (email, token) => {
  return api.post('/verifyToken/', {
    email: email,
    token: token,
  })
}
export const resetForgotPassword = (email, newPassword, confirmPassword) => {
  return api.post('/resetForgotPassword/', {
      email,
      newPassword,
      confirmPassword,
  })
}

const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    resetPassword,
    requestPasswordToken,
    verifyToken,
    resetForgotPassword
}

export default apis
