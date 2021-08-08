// gets parameter 'param' from the URL
export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// returns whether device is a touch device
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

// returns whether device is a mobile device
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// gets an array of the highlighted nodes from the 'nodes' parameter
export function getHighlightedNodes() {
  const h = getParam('nodes');
  if (h) {
    return h.split(',');
  }
  return null;
}

// gets an array of the highlighted nodes from the 'nodes' parameter
export function getYear() {
  const y = getParam('year');
  if (y) {
    return y;
  }
  return 4;
}

// gets ApiUrl using subject, course and year
export const getApiUrl = (s, c, y) => {
  if (s && c) {
    return `api/subject/${s}`;
  } else if (s) {
    return `api/subject/${s}?year=${y}`;
  }
};

// gets new route using subject, course and year
export const getRoute = (s, c, y) => {
  if (s && c) {
    return `/subject/${s}/course/${c}`;
  } else if (s) {
    return `/subject/${s}?year=${y}`;
  }
};
