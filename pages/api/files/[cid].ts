import type { NextApiRequest, NextApiResponse } from "next";
import { retrieveFiles } from "@/app/components/extras/storage/init";

type Data = {
  error: boolean;
  message: string;
  leads: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
   if (req.method == 'GET') {

      const { cid } = req.query;

      try {

        const leadCsv = await retrieveFiles(cid as string);


        const leadData = leadCsv.split('\n');

        const headers = leadData.shift().split(',');
        

        const leads = leadData.map((lead: any) => {

          const leadObj = lead.split(',');

          return {...headers.reduce((acc:any, header: any, i: number) => {
            acc[header] = leadObj[i];
            return acc;
          }, {}), cid: cid as string};

        });

        res.status(200).json({ error: false, message: 'Success', leads })

      } catch (error) {

          res.status(404).json({ error: true, message: 'Not Found', leads: []})

      }
   }
}
