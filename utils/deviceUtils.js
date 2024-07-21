// deviceUtils.js

export const isIOS = () => {
  if (navigator && navigator.userAgent) {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }
  return false;
};

export const isMac = () => {
  if (navigator && navigator.platform) {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }
  return false;
};
