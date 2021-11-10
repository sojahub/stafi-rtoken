import { message } from 'antd';
import axios from 'axios';
import config from 'src/config/index';
 
const toastTimeout = 500;

export default {

  fetchRtokenPriceList: function () {
    return this.post(
      config.stafiApi + '/stafi/v1/webapi/rtoken/pricelist',
      {}
    );
  },
  post: function (api, postData) {
    postData = postData ? postData : {};
    postData.timestamp = new Date().getTime();
    return new Promise(resolve => {
      axios.post(
        api,
        postData
      )
      .then(response => {
          let data = response.data;
          resolve(data);
        })
        .then(null, function(error) { 
          let isToast = postData.isLoading === true ? true : false;
          if (isToast) {
            setTimeout(function() {
              message.error('Error: please try again');
            }, toastTimeout);
          }
        });
    });
  }
};
  