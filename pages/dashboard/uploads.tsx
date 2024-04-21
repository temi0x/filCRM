import Base from "@/app/components/base";
import Head from "next/head";
import {
  Button
} from "@mui/material";
import Image from "next/image";
import empty from "@/public/images/empty.png";
import { FaPlus} from "react-icons/fa";
import { BsPlusLg } from "react-icons/bs";
import { useContext, useState, useEffect, useRef } from "react";
import FileDes from "@/app/components/designs/file";
import { GenContext } from "@/app/components/extras/contexts/genContext";


const Uploads = () => {

     const [isLoading, setLoading] = useState<boolean>(false)

     const { fileList = [] } = useContext<any>(GenContext);

     console.log(fileList, 'ss')

     const triggerUpload = async (
       w: React.SyntheticEvent & { target: HTMLInputElement }
     ) => {
       if (w.target.files) {
        //  await uploadFiles(w.target.files);
       }
     };

     const dropHere = async (event: React.DragEvent<HTMLDivElement>) => {
       event.stopPropagation();
       event.preventDefault();
       const fileList = event.dataTransfer.files;
    //    await uploadFiles(fileList);
     };

     const dragHere = (event: React.DragEvent<HTMLDivElement>) => {
       event.stopPropagation();
       event.preventDefault();
       event.dataTransfer.dropEffect = "copy";
     };


    return (
      <>
        <Head>
          <title>Uploads | filCRM</title>
        </Head>

        <Base>
          <div
            onDragOver={(event) => {
              dragHere(event);
            }}
            onDrop={(event) => {
              dropHere(event);
            }}
            className="w-full flex items-start justify-between filedrop min-h-screen"
          >

            <input
              type="file"
              onChange={triggerUpload}
              className="!hidden input_upload"
              style={{
                display: "none",
                visibility: "hidden",
              }}
            />

            <div className="w-full st:!pl-0 pb-[20px] px-5 transition-all delay-500 h-full flex flex-col">
              <div className="my-2">
                <h2 className="font-bold text-[25px] mt-[14px] mb-3">
                  Uploads
                </h2>
              </div>
              <div className="h-full">
                <div>
                  {!Boolean(fileList.length) && !isLoading && (
                    <div
                      className="empty"
                      style={{
                        display: "flex",
                        width: "100%",
                        height: "fit-content",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div className="h-[259px] justify-center w-full my-5 flex">
                        <Image
                          src={empty}
                          className="mb-3"
                          width={350}
                          height={259}
                          alt="No files yet"
                        />
                      </div>

                      <div className="mt-2 mb-3">
                        {/* <h2 className="text-[22px] text-center font-bold">
                          Drop files here
                        </h2> */}
                        <span className="mt-2 text-[17px] flex w-full text-center">
                          Use the `{<FaPlus size={17} />}` button on the sidebar to upload leads
                        </span>
                      </div>
                    </div>
                  )}

                  {Boolean(fileList.length) && (
                    <div
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(140px, 1fr))",
                      }}
                      className="flist pt-7 grid gap-2 grid-flow-dense"
                    >
                      {fileList.map((e: any, i: number) => {
                        return (
                          <FileDes
                            key={i}
                            data={{
                              name: e["name"],
                              size: e["size"] * 1024,
                              key: i + 1,
                            }}
                            text={'csv'}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Base>
      </>
    );
}

export default Uploads;