const axios = require('axios');
const { BadRequest, AuthenticationError, NotFoundError, AppError } = require('../core/error');

const instance = axios.create({
  baseURL: process.env.BASE_API || 'http://localhost:3000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// instance.interceptors.request.use(
//   (config) => {
//     const token = process.env.JWT_TOKEN;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// instance.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     if (error.response) {
//       const { status, data } = error.response;
//       switch (status) {
//         case 400:
//           throw new BadRequest(data.message || 'Bad Request');
//         case 401:
//           throw new AuthenticationError('Unauthorized - Please login');
//           break;
//         case 404:
//           throw new NotFoundError('Resource not found');
//         default:
//           throw new AppError('An error occurred');
//       }
//     } else if (error.request) {
//       throw new Error('No response from server');
//     } else {
//       throw new Error('Request failed');
//     }
//     return Promise.reject(error);
//   }
// );

module.exports = instance;
