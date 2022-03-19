// export const formatDuration = (seconds) => {
//   var sec_num = parseInt(seconds, 10);
//   var hours = Math.floor(sec_num / 3600);
//   var minutes = Math.floor((sec_num - hours * 3600) / 60);
//   var seconds = sec_num - hours * 3600 - minutes * 60;

import moment from 'moment';

//   // if (hours < 10) {
//   //   hours = '0' + hours;
//   // }
//   // if (minutes < 10) {
//   //   minutes = '0' + minutes;
//   // }
//   // if (seconds < 10) {
//   //   seconds = '0' + seconds;
//   // }
//   return hours + 'h' + minutes + 'm';
// };

export const formatDuration = (milliSeconds) => {
  if (milliSeconds <= 0) {
    return '00:00:00:00';
  }
  const sec_num = (parseInt(milliSeconds, 10) / 1000).toFixed(0);
  var days = Math.floor(sec_num / (3600 * 24));
  var hours = Math.floor((sec_num - days * 3600 * 24) / 3600);
  var minutes = Math.floor((sec_num - days * 3600 * 24 - hours * 3600) / 60);
  var seconds = sec_num - days * 3600 * 24 - hours * 3600 - minutes * 60;

  if (days < 0) {
    days = '00';
  } else if (days < 10) {
    days = '0' + days;
  }
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return `${days}:${hours}:${minutes}:${seconds}`;
};

export function formatTimeMillis(timeMillis, template = 'yyyy-MM-dd HH:mm:ss') {
  return moment(timeMillis).format(template);
}
