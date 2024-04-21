import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import validator from 'validator';
import { ethers } from "ethers";

type Data = {
  message: string;
  error: boolean;
  user?: any;
  token?: string;
  latest?: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if (req.method == "POST") {

      const { address, hash } = req.body;

      const validateAddress = ethers.verifyMessage(
        "Welcome to FilCRM",
        hash
      );

      if (!validator.isEthereumAddress(address)) {
        res.status(400).json({ error: true, message: "Invalid user address" });
        return;
      }

      try {

        if (validateAddress == address) {

          const {
            data: { user, token },
          } = await axios.post("/fil/auth", { address }, {
            baseURL: process.env.NEXT_PUBLIC_APP_URL || "",
            headers: { "X-App-Key": process.env.NEXT_PUBLIC_APP_KEY || "" },
          });

          const cids = user.cids.reverse();

          let leads: any[] = [];

          if (cids.length) {
              const { cid } = cids[0];

            

          }

          res.status(200).json({
            message: "Success",
            error: false,
            user: { ...user, cids },
            token,
            latest: leads
          });


        } else {
          res.status(400).json({ error: true, message: "Invalid hash" });
        }

      } catch (err) {

        const error = err as any;

        console.log(error);

        res
          .status(error?.status || 400)
          .json({
            error: true,
            message:
              error?.response?.data.message ||
              "Something went wrong, please try again",
          });
      }

    } else {
      res.status(422).json({
        message: "Method not supported",
        error: true,
      });
    }
}
