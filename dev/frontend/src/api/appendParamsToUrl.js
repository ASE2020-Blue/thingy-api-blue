export function appendParamsToUrl(url, params) {
  return `${url}?${Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&")}`;
}
