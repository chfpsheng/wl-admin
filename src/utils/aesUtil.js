import * as CryptoJS from 'crypto-js'
export const getAesString = (data, key, iv) => {//加密
  const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key),
    {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  return encrypted.toString();    //返回的是base64格式的密文
}

