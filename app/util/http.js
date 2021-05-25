 import { includes } from 'lodash';
import { createBrowserHistory, createHashHistory } from 'history'; 
import axios from 'axios'; 
import {message} from 'antd'; 
import webConfig from '@config/index'  
let loadingTimer = null;
const clearLoading = () => {
  clearTimeout(loadingTimer);
  //Toast.hide();
}; 

export const baseName = '/';
export const history = createBrowserHistory({ baseName });
export const hashHistory = createHashHistory({ baseName });
/**
 * @param [array] argu
 */
export const windowOpen = (...argu) => {
  const url = `${baseName}${argu[0]}`;
  argu.shift();
  return window.open(url, ...argu);
};
export const scrollToTop = () => window.scrollTo(0, 0);
export const closePage = () => {
  window.opener = null;
  window.open('', '_self');
  window.close();
};

 
  

// the authorize algorithm goes here
export const authorized = (allowed, currentRole) => includes(allowed, currentRole);

 

const axiosInstance = axios.create({
  baseURL: window.location.origin,
  timeout: 500000,
  // headers: {   },  
  //withCredentials: true,
  //responseType: 'json',
  // proxy: {
  //   host: '',
  //   port: 8888
  // }
});
 

 
 
 
 
 

export const toQueryParam = (queryParams) => {
  const params = new URLSearchParams();
  Object.keys(queryParams).forEach((key) => {
    if (typeof queryParams[key] !== 'undefined' && queryParams[key] !== null) {
      params.append(key, queryParams[key]);
    }
  });
  return params;
}; 
export const GETWAY = `${webConfig.webApiSite}/stafi/v1`;
 

const urlShim = (url) => {
  return `${GETWAY}/${url}`;
};
 

axiosInstance.interceptors.request.use(
  function (config) { 
    let headers = Object.assign({}, config.headers,  );  
    return Object.assign({}, config, { headers });
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    // TODO:
    // let refreshToken = response.headers['X-ACCESS-TOKEN']; 
    // if (refreshToken) { 
    //   setSessionStorageItem('USER_TOKEN', refreshToken);
    // }
 
    if (response.data.code && response.data.code != "0") {
      message.error(response.data.message);
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const api = {
  /**
   * @param: url
   * @param: method: get | post | put | delete | head | options | patch
   * @param: headers
   * @param: queryParams
   * ...: responseType/
   */
  request: (argu) => {

    clearLoading();
    if (!argu.closeLoading) {
      loadingTimer = setTimeout(() => {
        //Toast.loading('加载中...', 0);
      }, 200);
    }
    let config = {};
    const { url, method, queryParams, data: res, ...rest } = argu;
    if (!argu.url) {
      throw new Error('No request url');
    } else {
      config.url = url;
    }
    if (argu.method) {
      config.method = method;
    }
    if (queryParams) {
      config.params = toQueryParam(queryParams);
    }
    if (res) {
      config.data = res;
    }

    config = Object.assign({}, config, { ...rest });
    return axiosInstance
      .request(config)
      .then((res) => {
        clearLoading();
        if (config.isDownload) {
          try {
            const {
              headers: { 'content-disposition': contentDisposition },
            } = res;
            const downFileName = decodeURIComponent(
              contentDisposition.match(/fileName[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1]
            );
            // setSessionStorageItem(POS_DOWNLOAD_FILE_NAME, downFileName);
          } catch (error) {
            message.error('Request exception');
          }
        }
        return Promise.resolve(res.data);
      })
      .catch((err) => {
        clearLoading();
        if (config.ignoreError) {
          // hotfix: no error message to pop up but should re-login if token is invalid
          const data = err && err.response && err.response.data;
          if (data && data.code === 401) {
            sessionStorage.clear();
            // window.location.href = PPN_LOGIN;
            console.error('TODO: catch error');
          }
          return Promise.reject(err);
        }
        if (err.response) {
          const data = err.response.data;
          if (data && data.code === 401) {
            sessionStorage.clear();
            console.error('TODO: catch error');
          } else if (err.response && err.response.status === 500) {
            message.error('Server exception, please contact administrator');
          } else {
            !argu.hideMsg && message.error((data && data.message) || 'internet error'); // TBD
          }
        } else {
          message.error('The request timed out. Please try again later');
        }
        return Promise.reject(err);
      });
  },

  get: (url, queryParams = {}, config) => {
    return api.request({
      url: urlShim(url),
      queryParams: queryParams,
      ...config,
    });
  },

  post: (url, data, config, queryParams = {}) => {
    return api.request({
      url: urlShim(url),
      method: 'post',
      queryParams: queryParams,
      data: data,
      ...config,
    });
  },

  put: (url, data, config) => {
    return api.request({
      url: urlShim(url),
      method: 'put',
      data: data,
      ...config,
    });
  },
  patch: (url, data, config) => {
    return api.request({
      url: urlShim(url),
      method: 'patch',
      data: data,
      ...config,
    });
  },
  delete: (url, data, config) => {
    return api.request({
      url: urlShim(url),
      method: 'delete',
      data: data,
      ...config,
    });
  },

  // Be careful to use this function
  changeGlobalAxiosInstance: (params) => {
    Object.keys(params).forEach((element) => {
      axiosInstance.defaults[element] = params[element];
    });
  },
};

