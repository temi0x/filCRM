import Link from "next/link";
import {
  LinearProgress,
  Button,
  IconButton,
  Popper,
  ToggleButtonGroup,
  ToggleButton,
  Box
} from "@mui/material";
import Router from "next/router";
import Image from "next/image";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { PieChart, Cell, Pie } from "recharts";
import empty from "../../../public/images/empty.png";
import { FaRegFolderOpen, FaPlus, FaTrash, FaRegClock } from "react-icons/fa";
import {
  BsChatText,
  BsChatTextFill,
  BsCloudy,
  BsGrid3X3Gap,
  BsList,
  BsPeople,
  BsPinAngle,
  BsPlusLg,
} from "react-icons/bs";
import { TbSearch } from "react-icons/tb";

import FolderDes from "../../components/designs/folder";
import FileDes from "../../components/designs/file";
import { useContext, useState, useEffect, useRef } from "react";
import { GenContext } from "../../components/extras/contexts/genContext";
import Loader from "../../components/loader";
import {
  lq,
  beginStorageProvider,
  retrieveFiles,
  storeFiles,
} from "../extras/storage/init";
import { logout } from "../../components/extras/logout";
import Dash from "../dash";
import { useAccount } from "wagmi";
import { encrypt } from "../extras/chat/functions";
import { store } from "../types";
import io from 'socket.io-client'
import stc from "string-to-color";


let socket:any;

const Storage = ({ loading: loadingModal }: { loading: boolean }) => {
  const [currentDir, setCurrentDir] = useState<string[]>(["main"]);

  const loadOnce = useRef<boolean>(true);

  const { address, isConnected } = useAccount();

  /* upload */
  const uploadData = useContext(GenContext);

  const [loginData, setLoginData] = useState<{
    name: string;
    contract: string;
    data: string;
    participants: any;
  }>();

  const colors = [
    "#FAEDCB",
    "#C6DEF1",
    "#C9E4DE",
    "#FACBCB",
    "#F7D9C4",
    "#F1E4F1"
  ];

  const dirContent =
    uploadData.fileList !== undefined ? uploadData.fileList : [];

  const { success, error, loading, updateSuccess, updateLoading, errUpdate } =
    uploadData;

  const triggerUpload = async (
    w: React.SyntheticEvent & { target: HTMLInputElement }
  ) => {
    if (w.target.files) {
      await uploadFiles(w.target.files);
    }
  };

  const [update, setUpdate] = useState<boolean>(false);

  const [fileData, setFileData] = useState({});
  const [isLoading, setLoader] = useState(true);

  const { name, contract, data, participants } = loginData || {
    name: "",
    contract: "",
    main: "",
    participants: {},
  };

  const socketInit = async () => {
    await fetch(`/api/storage?lq=${data}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    socket = io();

    socket.on("connect", () => {
      socket.emit("join", name);
    });

    const updateFl = async (data: any) => {
      const dir: any = await retrieveFiles(currentDir);

      setLoader(false);
      setFileData(dir);

      uploadData.updateFile?.(dir);

      setUpdate(!update);
    };

    socket.on("add_fle", updateFl);
  };

  useEffect(() => {
    if (loadOnce.current && data) {
      loadOnce.current = false;

      socketInit();
    }
  }, [data]);

  useEffect(() => {
    async function init() {
      await beginStorageProvider({
        user: address || "",
        contract,
        randId: data,
        participants,
      });

      const dir: any = await retrieveFiles(currentDir);

      setLoader(false);
      setFileData(dir);

      uploadData.updateFile?.(dir);

      setUpdate(!update);
    }

    if (name !== undefined && Boolean(data)) {
      init();
    }
  }, [data, currentDir, contract, name]);

  const uploadFiles = async (files: FileList) => {
    updateLoading(true);

    const blobFiles: File[] = Array.from(files);

    // await uploadProvider(blobFiles, maxSize);
  };

  const dropHere = async (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    await uploadFiles(fileList);
  };

  const dragHere = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  /*end of upload*/

  const [lead, setLead] = useState<any[]>([]);

  let newLeads: any = {};

  lead.map((aLead) => {
    if (newLeads[aLead.leadsource]) {
      newLeads[aLead.leadsource] += 1;
    } else {
      newLeads[aLead.leadsource] = 1;
    }
  });

  let newleads: any[] = [];
  Object.keys(newLeads).map((eachLead) => {
    newleads.push({
      name: eachLead,
      value: (newLeads[eachLead] / lead.length) * 100,
    });
  }); 

  const updatedNewLeads = newleads.map((item, index) => {
    const newcolor = colors[index];

    return {
      ...item,
      color: newcolor,
    };
  });

  const roundnumber = (value: number) => {
    // Check if the number has a fractional part
    const hasFractionalPart = value % 1 !== 0;

    // Round to one decimal place only if there's a fractional part
    return hasFractionalPart ? Math.round(value * 10) / 10 : value;
  };

  const filteredlead = lead.filter((item) => {
    return true;
  });

  const progressbarvalue = (filteredlead.length / lead.length) * 100;

  const filteredleadsuccess = lead.filter(
    (item) => item.status === "success"
  );

  return (
    <>
      <Dash />
      {/* {(isLoading || notInit) && <Loader />} */}

      {/* {!isLoading && !notInit && ( */}
      {
        <>
          <div
            onDragOver={(event) => {
              dragHere(event);
            }}
            onDrop={(event) => {
              dropHere(event);
            }}
            className="w-full flex pt-5 px-5 items-start justify-between filedrop min-h-screen"
          >
            {/* continue here instead */}

            <div className="grid w-full grid-cols-2 gap-6">
              <div className=" p-3  border bg-white rounded-lg border-solid border-#CBCBCB-500">
                <p className="mb-4 font-aeonikmedium"> Lead source</p>
                <div
                  className=" flex gap-5 items-center focus:outline-none"
                  tabIndex={-1}
                >
                  <div className="">
                    <PieChart width={200} height={200}>
                      <Pie data={newleads} dataKey="value" outerRadius={100}>
                        {newleads.map((entry, index) => (
                          <Cell
                            style={{
                              outline: "none",
                            }}
                            key={`cell-${index}`}
                            fill={
                              entry.value > 0
                                ? colors[index % colors.length]
                                : "yellow"
                            }
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                  <div className=" flex flex-col gap-3 pt-4">
                    {updatedNewLeads.map((item, ii) => {
                      return (
                        <div key={ii} className="flex flex-row gap-4 items-center	">
                          <div
                            className={`w-2 h-2 rounded-full`}
                            style={{
                              backgroundColor: `${item.color}`,
                            }}
                          >
                            {" "}
                          </div>
                          <p className="font-aeonikmedium">
                            {item.name} ({roundnumber(item.value)}%)
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className=" h-15 bg-white rounded-lg p-5 border border-solid border-#CBCBCB-500 flex flex-col ">
                <div className="flex flex-row justify-between mb-6">
                  <h2 className="font-aeonikmedium"> Conversion rate</h2>

                  <div className="flex flex-row gap-8">
                   
                    {/* <Input
                          months={months}
                          inputChange={inputChange}
                          value={inputvalue}
                        /> */}


                    {/* <Year
                          years={years}
                          change={yearChange}
                          value={selectedyear}
                        /> */}
                  </div>
                </div>

                <div className=" flex justify-center ">
                  <CircularProgressbarWithChildren
                    value={progressbarvalue}
                    circleRatio={0.5}
                    strokeWidth={10}
                    text={String(filteredlead.length > 0 ? filteredlead.length : 0)}
                    // subtext="20"
                    styles={{
                      root: {
                        transform: "rotate(0.75turn)",
                        height: "220px",
                        width: "220px",
                      },
                      path: {
                        stroke: "#667185",
                        strokeLinecap: "round",
                      },
                      trail: {
                        stroke: "#C4C4C4",
                        strokeLinecap: "round",
                      },
                      // trailColor: "grey",
                      // background: "red",

                      text: {
                        fill: "black",
                        fontSize: "12px",
                        transform: " translatex(5px)rotate(90deg)",
                        transformOrigin: "center center",
                      },
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        marginTop: -80,
                      }}
                    >
                      <p className="font-aeonikregular text-[#425466] ">
                        Total leads acquired
                      </p>
                    </div>
                  </CircularProgressbarWithChildren>
                </div>

                <div className="flex justify-between align-center">
                  <div className="flex gap-1">
                    {" "}
                    <p className="font-aeonikregular text-[#425466] text-sm">
                      Leads converted{" "}
                    </p>{" "}
                    <p className="font-aeonikmedium text-sm">
                      {" "}
                      {filteredleadsuccess.length}
                    </p>{" "}
                  </div>

                  <div className="flex gap-1">
                    {" "}
                    <p className="font-aeonikregular text-[#425466] text-sm ">
                      {" "}
                      Conversion rate
                    </p>
                    <p className="font-aeonikmedium text-sm">
                      {" "}
                      {filteredleadsuccess.length > 0
                        ? Math.round(
                            (filteredleadsuccess.length / lead.length) * 100
                          )
                        : 0}
                      %
                    </p>{" "}
                  </div>
                </div>
              </div>
            </div>

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

            {/* <div className="w-full st:!pl-0 pb-[65px] transition-all delay-500 h-full flex flex-col">
              {loading && (
                <Box>
                  <LinearProgress
                    variant="indeterminate"
                    sx={{
                      backgroundColor: "#ececec",
                      color: "#ececec",
                      height: 5,
                      width: "100%",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#ff5555",
                        borderBottomRightRadius: "16px",
                        borderTopRightRadius: "16px",
                      },
                    }}
                  />
                </Box>
              )}

              <div className="px-5 h-full">
                <div className="px-1">
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
                          "repeat(auto-fill, minmax(150px, 1fr))",
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
            </div> */}
          </div>
        </>
      }
    </>
  );
};

export default Storage;
