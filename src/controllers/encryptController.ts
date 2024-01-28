import CryptoJS from "crypto-js";

const secretKey = "secretKey";

export const encryptData = (data: any) => {
  const dataStr = JSON.stringify(data);
  const ciphertext = CryptoJS.AES.encrypt(dataStr, secretKey).toString();
  return ciphertext;
};
