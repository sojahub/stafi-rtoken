import axios from 'axios';
import config from '@config/index';
import { message } from 'antd';
 
const toastTimeout = 500;

export default {

  // get stafi staker apr
  fetchStafiStakerApr: function (postData) {
    return this.post(
      config.api() + '/stafi/v1/webapi/rfis/stakerapr',
      postData
    );
  },

  // get stafi validator apr
  fetchStafiValidatorApr: function (postData) {
    return this.post(
      config.api() + '/stafi/v1/webapi/rfis/validatorapr',
      postData
    );
  },

  // get apr
  fetchArp: function (postData) {
    return this.post(
      config.api() + '/stafi/v1/webapi/reth/arp',
      postData
    );
  },

  // get pool list
  fetchStakingPoolList: function (postData) {
    return this.post(
      config.api() + '/stafi/v1/webapi/reth/poolist',
      postData
    );
  },

  // get pool detail
  fetchStakingPoolDetail: function (postData) {
    return this.post(
      config.api() + '/stafi/v1/webapi/reth/poolinfo',
      postData
    );
  },

  // get pool status
  fetchStakingPoolStatus: function (postData) {
    return this.post(
      config.api() + '/stafi/v1/webapi/reth/poolstatus',
      postData
    );
  },
  fetchStakingPoolinfo: function () {
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
  