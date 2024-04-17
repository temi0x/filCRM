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


const Uploads = () => {

     const [isLoading, setLoading] = useState<boolean>(false)

     const dirContent: any[] = [
        {
            name: "this is a test to know if this is working",
            size: 100,
            key: "fileid1",
            extension: "csv",
        },
        ...Array.from({ length: 19 }, (_, i) => ({
            name: `file${i + 2}`,
            size: Math.floor(Math.random() * 100),
            key: `fileid${i + 2}`,
            extension: "csv",
        })),
     ];

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
            <Button
              onClick={() => {
                const elem = document?.querySelector(
                  ".input_upload"
                ) as HTMLElement;

                elem?.click();
              }}
              className="!py-2 !mr-4 !flex !fixed !right-[15px] !bottom-[20px] !cursor-pointer !justify-center !z-[90] !items-center !px-4 !bg-[#ff5555] !text-[#e2e2e2] !border-solid !border-[#e2e2e2] !border-[2px] !w-[64px] !h-[64px] !rounded-[50%] overflow-hidden hover:bg-[#d52323] font-[300]"
            >
              <BsPlusLg size={25} />
            </Button>

            <input
              type="file"
              multiple
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
                  {!Boolean(dirContent.length) && !isLoading && (
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
                        <h2 className="text-[22px] text-center font-bold">
                          Drop files here
                        </h2>
                        <span className="mt-2 text-[17px] flex w-full text-center">
                          or use the `{<FaPlus size={17} />}` button
                        </span>
                      </div>
                    </div>
                  )}

                  {Boolean(dirContent.length) && (
                    <div
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(140px, 1fr))",
                      }}
                      className="flist pt-7 grid gap-2 grid-flow-dense"
                    >
                      {dirContent.map((e: any, i: number) => {
                        return (
                          <FileDes
                            key={i}
                            data={{
                              name: e["name"],
                              size: e["size"],
                              key: e["fileid"],
                            }}
                            text={e["extension"]}
                          />
                        );
                        // } else {
                        //   let size: number = 0;
                        //   e.forEach((x: any) => {
                        //     if (x.file) {
                        //       size += x.size;
                        //     }
                        //   });
                        //   return (
                        //     <FolderDes
                        //       key={i}
                        //       data={{
                        //         name: e["name"],
                        //         size,
                        //         key: i,
                        //         files: e["files"].length,
                        //       }}
                        //     />
                        //   );
                        // }
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