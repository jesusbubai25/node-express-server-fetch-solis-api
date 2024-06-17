const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config({ path: ".env" });

function hmacSHA1Encrypt(encryptText, keySecret) {
  const hmac = crypto.createHmac("sha1", keySecret);
  hmac.update(encryptText);
  return hmac.digest("base64");
}

function getGMTTime() {
  const date = new Date().toUTCString();
  return date;
}

function getDigest(text) {
  return crypto.createHash("md5").update(text).digest("base64");
}

const key = process.env.API_KEY_ID;
const keySecret = process.env.API_KEY_SECREAT;
const bodyData = {
  pageNo: 1,
  pageSize: 10,
};
const body = JSON.stringify(bodyData);
const contentMd5 = getDigest(body);
const date = getGMTTime();
const path = `POST/v1/${key}/userStationList`;
const param = `POST\n${contentMd5}\napplication/json\n${date}\n${path}`;
const sign = hmacSHA1Encrypt(param, keySecret);
const url = `https://www.soliscloud.com:13333/POST/v1/${key}/userStationList`;

axios({
  method: "post",
  url: url,
  headers: {
    "Content-type": "application/json;charset=UTF-8",
    "Authorization": `API ${key}:${sign}`,
    "Content-MD5": contentMd5,
    "Date": date
  },
  data: body,
})
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error.response.data);
  });
