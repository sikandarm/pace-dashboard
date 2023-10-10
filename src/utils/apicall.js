import axios from 'axios';

const ApiCall = axios.create({
  baseURL: process.env.REACT_APP_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the access token in the request headers
ApiCall.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// export const ApiCallUsingFetch = async (url, options = {}) => {
//   const token = localStorage.getItem('accessToken');
//   console.log(localStorage.getItem('accessToken'));
//   console.log(token);
//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token}`,
//     ...options.headers,
//   };

//   return fetch(`${process.env.REACT_APP_URL}/${url}`, { ...options, headers })
//     .then((response) => {
//       console.log('-=>', response.json());
//       return response.json();
//     })
//     .catch((error) => {
//       console.error('API call failed:', error);
//       throw error;
//     });
// };

export default ApiCall;