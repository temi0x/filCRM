import { store, dir } from "../../types";
import * as PushAPI from "@pushprotocol/restapi";
import { ethers } from "ethers";
import axios from "axios";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
export let lq: any;

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

export const beginStorageProvider = async ({
  user,
  contract,
  randId,
  participants,
}: {
  user: string;
  contract: string;
  randId: any;
  participants: any;
}) => {

  lq = [randId, contract, participants, user];

};

export const retrieveFile = async (fileid: string) => {

  const token = `Bearer ${localStorage.getItem("token")}`;

      const {
        data: { file, key },
      } = await axios.get(`/dao/${lq[0]}/files/${fileid}`, {
        headers: { Authorization: token },
      });

      return { ...file, key };

}

export const retrieveFiles = async (folder?: string[]) => {

  const token = `Bearer ${localStorage.getItem("token")}`;

  const {
    data: { files },
  } = await axios.get(`/dao/${lq[0]}/files`, {
    headers: { Authorization: token },
  });

  return files.main == undefined ? files : files.main;

};


/**
 * @param dirfolder: array - showing file directory till destination
 *
 * **/

export const storeFiles = async (file: store[], dirfolder: string[]) => {

  for (let i = 0; i < file.length; i++) {
    
    const { name, type, size, cid, extension, tag } = file[i];

    await axios.post(
      `/dao/${lq[0]}/files`,
      {
        name,
        type,
        size,
        dir: dirfolder,
        cid,
        extension,
        tag,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  return file;
};
