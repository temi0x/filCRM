// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import Cryptr from "cryptr";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import nft from "../../../artifacts/contracts/localdao.sol/CloverSuiteNFT.json"
import { contractAddress } from "../../../app/contexts/IndexContext";


type Data = {
  message: string;
  error: boolean;
  token?: string
  dao?: any 
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
  if (req.method == 'POST') {

    const { name, email, address, hash, metadata } = req.body;

    if (name && email && address && metadata) {

      (async () => {

        const validateAddress = ethers.utils.verifyMessage(
          "UseClover Signature Request \n\nSign To Continue \n",
          hash
        );

        try{

          if (validateAddress != address) {
            throw {
              status: 400,
              response: {
                data: {
                  message: "Invalid address",
                },
              },
            };
          }

        const providers = new ethers.providers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_RPC || ""
        );

        const wallet = new ethers.Wallet(
          process.env.NEXT_PUBLIC_MATIC_PRIVATE_KEY || ""
         );

         const signer = wallet.connect(providers)

         const contractFac = new ethers.Contract(
           contractAddress,
           nft.abi,
           signer
         );

         await contractFac.mintTokens([address], metadata);

        const {
          data: { group: { data: gdata } },
        } = await axios.get("/test/1/1", {
          baseURL: process.env.NEXT_PUBLIC_APP_URL || "",
          headers: {
            "X-App-Key": process.env.APP_KEY || "",
          },
        });

        const groupData = JSON.parse(gdata);

        let encryptedData = undefined;

        if (groupData.admins !== undefined) {

          const [ { key: encryptedKeys } ] = groupData.admins

          const key = process.env.SIGNATURE || ""

          const enc = new Cryptr(key);

          const decryptedKeys = enc.decrypt(encryptedKeys);         

          const enc_new = new Cryptr(hash);

          encryptedData = enc_new.encrypt(decryptedKeys);

        }

        const { data } = await axios.post(
          "/testing/store",
          {
            name,
            email,
            address,
            group: encryptedData
          },
          {
            baseURL: process.env.NEXT_PUBLIC_APP_URL || "",
            headers: {
              "X-App-Key": process.env.APP_KEY || "",
            },
          }
        );

        res.status(201).json({
          message: "Success",
          dao: {...data.dao, hash},
          error: false,
          token: data.token
        })

      }catch(err){

          const error = err as any;

          console.log(error)

          res.status(error?.status || 400).json({
            error: true,
            message: error?.response?.data?.message || "Something went wrong, please try again"
          })
      }

      })()

    }else{
      res.status(400).json({
        message: "Missing required fields",
        error: true,
      })
    }

  }else{
      res.status(422).json({
          message: "Method not supported",
          error: true,
      });
  }

}
