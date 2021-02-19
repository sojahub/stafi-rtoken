import axios from 'axios';
import config from '../config/env';
import { Toast } from 'mint-ui';

const toastDuration = 3000;
const toastTimeout = 500;

export default {

  // get stafi staker apr
  fetchStafiStakerApr: function (postData) {
    return this.post(
      config.apis.api1 + '/stafi/v1/webapi/rfis/stakerapr',
      postData
    );
  },

  // get stafi validator apr
  fetchStafiValidatorApr: function (postData) {
    return this.post(
      config.apis.api1 + '/stafi/v1/webapi/rfis/validatorapr',
      postData
    );
  },

  // get apr
  fetchArp: function (postData) {
    return this.post(
      config.apis.api1 + '/stafi/v1/webapi/reth/arp',
      postData
    );
  },

  // get pool list
  fetchStakingPoolList: function (postData) {
    return this.post(
      config.apis.api1 + '/stafi/v1/webapi/reth/poolist',
      postData
    );
  },

  // get pool detail
  fetchStakingPoolDetail: function (postData) {
    return this.post(
      config.apis.api1 + '/stafi/v1/webapi/reth/poolinfo',
      postData
    );
  },

  // get pool status
  fetchStakingPoolStatus: function (postData) {
    return this.post(
      config.apis.api1 + '/stafi/v1/webapi/reth/poolstatus',
      postData
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
          console.log(error);
          let isToast = postData.isLoading === true ? true : false;
          if (isToast) {
            setTimeout(function() {
              Toast({
                message: 'Error: please try again',
                duration: toastDuration
              });
            }, toastTimeout);
          }
        });
    });
  }
};
  