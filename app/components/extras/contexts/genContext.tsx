import { createContext, useEffect, useState } from "react";
import { store } from "../../types";
import { retrieveFiles } from "../storage/init";
import axios from "axios";

export const GenContext = createContext<any>({
    fileList: [],
    leads: [],
});

export const GenProvider = ({children}: {children: JSX.Element | JSX.Element[]}) => {

    const [dirFiles, updateFiles] = useState<store[]>([]);

    const [leads, setLeads] = useState<any[]>([]);

    useEffect(() => {
      const user = localStorage.getItem("user");

      if (user) {
        const data = JSON.parse(user);

        if (data) {
          updateFiles(data.cids.map((e: store) => ({...e, size: Number(e.size)})));
        }

      }
    }, []);

    useEffect(() => {
        if (dirFiles.length) {
            dirFiles.map((data: store) => {
                const cid = data.cid;

                (async () => {
                  
                   try {

                    if (leads.find((val) => val.cid == cid)) {
                        return;
                    }

                    const { data } = await axios.get('/api/files/' + cid);

                    setLeads((prev: store[]) => {
                        return prev.find((val) => val.cid == cid) ? prev : [...prev, ...data.leads];
                    });

                   } catch (error) {
                       console.log(error);
                   }

                })();
            })
        }
    }, [dirFiles])

    return (
      <GenContext.Provider
        value={{
          fileList: dirFiles,
          updateFile: (files: store[]) => updateFiles(files),
          addFiles: (file: store) => updateFiles((prev) => [...prev, file]),
          leads,
        }}
      >
        {children}
      </GenContext.Provider>
    );
}