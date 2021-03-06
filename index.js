const {get} = require('https');
const endpoints = require('./endpoints.json');

function getContent(url) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      const {statusCode} = res;
      if(statusCode !== 200) {
        res.resume();
        reject(`Request failed. Status code: ${statusCode}`);
      }
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {rawData += chunk});
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData);
        } catch(e) {
          reject(`Error: ${e.message}`);
        }
      });
    }).on('error', (err) => {
      reject(`Error: ${err.message}`);
    })
  });
}

class NekoClient {
  constructor() {
    let self = this;
    let baseURL = 'https://nekos.life/api/v2';
    Object.keys(endpoints.sfw).forEach(async (endpoint) => {
      self[`getSFW${endpoint}`] = async function () { return await getContent(baseURL + endpoints.sfw[endpoint]);};
    });
    Object.keys(endpoints.nsfw).forEach( async (endpoint) => {
      self[`getNSFW${endpoint}`] = async function () { return await getContent(baseURL + endpoints.nsfw[endpoint]);};
    });
  }
}

module.exports = NekoClient;
