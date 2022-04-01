import axios from 'axios'
import { registerFormType, loginType, profileFormType, emailFormType, passwordFormType, createPostFormType } from '../types';

const api = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:5555/api/'
});

export function getExperiences() {
  return api.get('experiences', {})
    .then((res) => {
      return res.data
    })
};

export function registerUser(user: registerFormType) {
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

export function getUserProfile() {
  return api.get('users/id', {}).then((res) => {
    return res.data
  });
};

export function updateUserProfile(profileFormValues: profileFormType) {
  return api.post('users/id/updateprofile', profileFormValues, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
  .then((res) => {
    return res.data
  });
};

export function updateUserEmail(emailFormValues: emailFormType) {
  return api.post('users/id/updateemail', emailFormValues, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
  .then((res) => {
    return res.data
  });
};

export function updateUserPassword(passwordFormValues: passwordFormType) {
  return api.post('users/id/updatepassword', passwordFormValues, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
  .then((res) => {
    return res.data
  });
};

export function getPostsByUserId() {
  return api.get('posts/userid', {})
  .then((res) => {
    return res.data
  });
};

export function getPostsByCompanyId() {
  return api.get('posts/companyid', {})
  .then((res) => {
    return res.data
  });
};

export function deletePostById(postId: number) {
  return api.post(`posts/id/${postId}`, {}, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
  .then((res) => {
    return res.data
  });
};

export function getCompanies() {
  return api.get('companies', {}).then((res) => {
    return res.data
  });
};

export function createPost(createPostFormValues: createPostFormType) {
  return api.post('posts/newpost', createPostFormValues, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
    .then((res) => {
      return res.data
    })
};