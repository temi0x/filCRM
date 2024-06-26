// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Cryptr from "cryptr";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "GET") {
    const { text, key } = req.query;

    if (!text || !key) {
      res.status(400).json({
        message: "Missing required fields",
        error: true,
      });

      return;
    }

    const cryptr = new Cryptr(key as string);

    const decrypted = cryptr.decrypt(text as string);

    res.status(200).json({
      message: "Success",
      result: decrypted,
      error: false,
    });
  } else {
    res.status(422).json({
      message: "Method not supported",
      error: true,
    });
  }
}
