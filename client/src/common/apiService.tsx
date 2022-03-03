import axios from 'axios'
import { userType, loginType } from '../types';

const api = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:5555/api/'
});

export function getPosts() {
  return api.get('posts', {})
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      return error.message
    })
};

export function getExperiences() {
  return api.get('experiences', {})
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      return error.message
    })
};

export function registerUser(user: userType) {
  return api.post('users/newuser', user, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
    .then((res) => {
      return res.data
    })
};

export function loginUser(loginValues: loginType) {
  return api.post('login', loginValues, {headers: {"Content-Type": "application/x-www-form-urlencoded"}});
};

export function logoutUser() {
  return api.post('logout', {}, {headers: {"Content-Type": "application/x-www-form-urlencoded"}});
};

export function validateLogin() {
  return api.post('validatelogin', {}, {headers: {"Content-Type": "application/x-www-form-urlencoded"}});
};