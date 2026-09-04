import axios from 'axios';
import { findWhere } from 'underscore';
const baseURL = import.meta.env.VITE_BASE_URL
const config = {
  appName: import.meta.env.VITE_APP_TITLE,
  baseURL,

  getAPI(data) {
    return new Promise((resolve, reject) => {
      let url = new URL(`${baseURL}${data.url}`)
      url.search = new URLSearchParams({ ...data.params, lang_code: 'EN' }).toString();
      fetch(url).then((response) => {
        if (response?.status === 401) {
          localStorage.removeItem('user_id');
          localStorage.removeItem('email');
          localStorage.removeItem("token");
          if (window.location.pathname !== "/") window.location.href = "/";
          return;
        } else{
          return response.json();
        }
      }).then((data) => {
        resolve(data)
        return;
      }).catch(error => {
        // console.log(error)
        reject(error)
        return;
      });
    })
  },
  postAPI(data) {
    return new Promise((resolve, reject) => {
      var retrievedObject = localStorage.getItem("token");
      fetch(`${baseURL}${data.url}`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': (retrievedObject) ? retrievedObject : ''
        },
        body: JSON.stringify({ ...data.params, lang_code: 'EN' })
      }).then((response) => {
        if (response?.status === 401) {
          localStorage.removeItem('user_id');
          localStorage.removeItem('email');
          localStorage.removeItem("token");
          if (window.location.pathname !== "/") window.location.href = "/";
          return;
        } else{
          return response.json();
        }
      }).then((data) => {
        resolve(data)
        return;
      }).catch(error => {
        // console.log(error)
        reject(error)
        return;
      });
    })
  },
  allAPI(data) {
    return new Promise((resolve, reject) => {
      var retrievedObject = localStorage.getItem("token");
      fetch(`${baseURL}${data.url}`, {
        method: (data.method) ? data.method : "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': (retrievedObject) ? retrievedObject : ''
        },
        body: JSON.stringify({ ...data.params, lang_code: 'EN' })
      }).then((response) => {
        if (response?.status === 401) {
          localStorage.removeItem('user_id');
          localStorage.removeItem('email');
          localStorage.removeItem("token");
          if (window.location.pathname !== "/") window.location.href = "/";
          return;
        } else{
          return response.json();
        }
      }).then((data) => {
        resolve(data)
        return;
      }).catch(error => {
        reject(error)
        return;
      });
    })
  },
  postFormDataAPI(data) {
    return new Promise((resolve, reject) => {
      var retrievedObject = localStorage.getItem("token");
      fetch(`${baseURL}${data.url}`, {
        method: "post",
        headers: {
          'contentType': "application/json",
          'Authorization': (retrievedObject) ? retrievedObject : ''
        },
        body: data.params
      }).then((response) => {
        if (response?.status === 401) {
          localStorage.removeItem('user_id');
          localStorage.removeItem('email');
          localStorage.removeItem("token");
          if (window.location.pathname !== "/") window.location.href = "/";
          return;
        } else{
          return response.json();
        }
      }).then((data) => {
        resolve(data)
        return;
      }).catch(error => {
        // console.log(error)
        reject(error)
        return;
      });
    })
  },
  getAPIaxios(data) {
    return new Promise(async (resolve, reject) => {
      try {
        var retrievedObject = localStorage.getItem("token");
        let result = await axios.get(`${baseURL}${data.url}`, {
          params: { ...data.params, code: 'EN' },
          headers: { 'Authorization': (retrievedObject) ? retrievedObject : '' },
        });
        resolve(result?.data?.payload)
        return;
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem('user_id');
          localStorage.removeItem('email');
          localStorage.removeItem("token");
          if (window.location.pathname !== "/") window.location.href = "/";
        }
        reject(error)
        return;
        // throw error;
      }
    })
  },
  deleteAPIaxios(data) {
    return new Promise(async (resolve, reject) => {
      try {
        var retrievedObject = localStorage.getItem("token");
        let result = await axios.delete(`${baseURL}${data.url}`, {
          params: { ...data.params, code: 'EN' },
          headers: { 'Authorization': (retrievedObject) ? retrievedObject : '' },
        });
        resolve(result?.data?.payload)
        return;
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem('user_id');
          localStorage.removeItem('email');
          localStorage.removeItem("token");
          if (window.location.pathname !== "/") window.location.href = "/";
        }
        reject(error)
        return;
      }
    })
  },
  accessRight(code, flag = "") {
    try {
      const rightsData = JSON.parse(localStorage.getItem('rightsData'));
      const whereFind = findWhere(rightsData, { code: code });
      return whereFind?.data
    } catch (error) {
      throw error
    }
  }
};

export default config;
