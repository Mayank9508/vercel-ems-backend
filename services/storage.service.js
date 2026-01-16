import dotenv from "dotenv";
dotenv.config();

import  ImageKit from "imagekit";



const storageInstance = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL,
});

export const uploadFileToIMAGEKIT = async (file, fileName) => {
  return await storageInstance.upload({
    file,
    fileName,
    folder: "EMS",
  });
};


