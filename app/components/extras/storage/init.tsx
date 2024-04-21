import { store } from "../../types";
import * as PushAPI from "@pushprotocol/restapi";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import axios, { AxiosProgressEvent } from "axios";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import toast from "react-hot-toast";

export const notifications = async ({
  title,
  message,
  receivers,
  exclude,
}: {
  title: string;
  message: string;
  receivers: string[];
  exclude: string;
}) => {
  const pk = process.env.NEXT_PUBLIC_MATIC_PRIVATE_KEY;

  const pkey = `0x${pk}`;

  const signer = new ethers.Wallet(pkey);

  const channel = `eip155:5:${process.env.NEXT_PUBLIC_PUBLIC_KEY}`;

  try {
    
    receivers.forEach(async (val: string) => {
      if (val.toLowerCase() == exclude.toLowerCase()) {
        return;
      }

      const receiver = `eip155:5:${val}`;

      await PushAPI.payloads.sendNotification({
        signer,
        type: 3,
        identityType: 2,
        notification: {
          title,
          body: message,
        },
        payload: {
          title,
          body: message,
          cta: "",
          img: "",
        },
        recipients: receiver,
        channel,
        env: ENV.STAGING,  
      });
    });

    return true;

  } catch (err) {
    console.log(err, "err");
  }
};



export const retrieveFiles = async (cid: string) => {

  const { data } = await axios.get(
    `https://gateway.lighthouse.storage/ipfs/${cid}`
  );

  return data;

};

export const getLead = (id: number | string, data: any[]) => {

   return data.find((val, i) => {
      if (val?.id) {
        if (val.id == id) {
          return val;
        }
      }else if (val?.uid) {
        if (val.uid == id) {
          return val;
        }
      }else if (id == i) {
          return val;
      }
   });

}


export const storeFiles = async (
  file: File,
  progressCallback: (ProgressEvent: AxiosProgressEvent) => number | void
) => {

  const token = localStorage.getItem('token');

  const formData = new FormData();

  formData.append("file", file);

  if (file.type !== "text/csv") {
    toast.error("Invalid file type");
    return;
  }

  const output = await axios.post(
    "https://node.lighthouse.storage/api/v0/add",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LIGHTHOUSE || ""}`,
      },
      onUploadProgress: progressCallback,
    }
  );

  const { data } = await axios.post('/fil/file/store', {
    cid: output.data.Hash,
    name: file.name,
    size: (file.size / 1024).toFixed(2)
  }, {
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "",
    headers: { "Authorization": `Bearer ${token}` },
  });

  // console.log("File Status:", output.data);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  user.cids = data.lead_files;

  localStorage.setItem("user", JSON.stringify(user));

  return data.lead_files;

};
