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
  BsPlusLg,
} from "react-icons/bs";
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
import { encrypt } from "../extras/functions";
import { store } from "../types";
import io from 'socket.io-client';
import TableComponent from "../../components/tableComponent";
import useFormatDate from "../tableComponent/formatDate";


let socket:any;

const Storage = ({ loading: loadingModal }: { loading: boolean }) => {

  const [currentDir, setCurrentDir] = useState<string[]>(["main"]);

  const [selectedLeads, setSelectedLeads] = useState<any[]>([]);

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

  const handleDeleteSelected = () => {
        
  }

  const [lead, setLead] = useState<any[]>([
    {
      id: 1766,
      leadfirstname: "John",
      leadlastname: "Philips",
      leadauthor: 145,
      leadauthorname: "Julia Gead",
      leadauthorlastname: null,
      leadstatus: "Pending",
      leaddestination: "USA",
      leadsource: "Refferals",
      leadlocation: "jos",
      leademail: "johnblack@gmail.com",
      leadphone: "8033445522",
      owner: "KAF79vF4pjv3",
      created_at: "2024-03-08T16:27:55.000000Z",
      updated_at: "2024-03-08T16:27:55.000000Z",
      month: "Mar",
      timeline: 2200,
    },
    {
      id: 1767,
      leadfirstname: "mathew",
      leadlastname: "Godwin",
      leadauthor: 145,
      leadauthorname: "Julia Gead",
      leadauthorlastname: null,
      leadstatus: "Pending",
      leaddestination: "Ethopia",
      leadsource: "Others",
      leadlocation: "Abuja",
      leademail: "mathew@gmail.com",
      leadphone: "8148158802",
      created_at: "2024-03-08T16:27:55.000000Z",
      updated_at: "2024-03-08T16:27:55.000000Z",
      month: "Mar",
      timeline: 2201,
    },
    {
      id: 1750,
      leadfirstname: "kalu",
      leadlastname: "paul",
      leadauthor: 145,
      leadauthorname: "Julia Gead",
      leadauthorlastname: "Enovertg",
      leadstatus: "Pending",
      leaddestination: null,
      leadsource: "Refferals",
      leadlocation: null,
      leademail: "kaludivine5@gmail.com",
      agentid: 191,
      assignedagent: "kalu Divine",
      leadphone: "15345475647",
      created_at: "2024-02-29T12:21:55.000000Z",
      updated_at: "2024-02-29T15:23:39.000000Z",
      month: "Feb",
      timeline: 2182,
    },
    {
      id: 1500,
      leadfirstname: "mark",
      leadlastname: "john",
      leadauthor: 145,
      leadauthorname: "Julia Gead",
      leadauthorlastname: "Enovertg",
      leadstatus: "Closed [Failed]",
      leaddestination: null,
      leadsource: "Manual entry",
      leadlocation: null,
      leademail: "johnmark@gmail.com",
      agentid: 191,
      assignedagent: "kalu Divine",
      leadphone: "15634767567",
      created_at: "2024-02-28T21:23:07.000000Z",
      updated_at: "2024-03-07T12:37:54.000000Z",
      month: "Feb",
      timeline: 1932,
    },
    {
      id: 500,
      leadfirstname: "john",
      leadlastname: "Obi",
      leadauthor: 145,
      leadauthorname: "Julia Gead",
      leadauthorlastname: "Enovertg",
      leadstatus: "Closed [Failed]",
      leaddestination: null,
      leadsource: "Refferals",
      leadlocation: null,
      leademail: "bi@gmail.com",
      agentid: 191,
      assignedagent: "kalu Divine",
      leadphone: "14575674780",
      property: null,
      owner: "KAF79vF4pjv3",
      leadcity: "",
      leadnote: "",
      referredagent: null,
      created_at: "2024-02-28T09:40:58.000000Z",
      updated_at: "2024-03-01T07:15:27.000000Z",
      month: "Feb",
      timeline: 927,
    },
    {
      id: 499,
      leadfirstname: "Joel",
      leadlastname: "George",
      leadauthor: 145,
      leadauthorname: "Julia Gead",
      leadauthorlastname: "Enovertg",
      leadstatus: "Ongoing",
      leaddestination: null,
      leadsource: "Refferals",
      leadlocation: null,
      leademail: "idiaghegeorge9@gmail.com",
      agentid: 191,
      assignedagent: "kalu Divine",
      leadphone: "19209203909",
      leadcity: "",
      leadnote: "",
      referredagent: null,
      created_at: "2024-02-27T11:28:13.000000Z",
      updated_at: "2024-02-29T12:11:14.000000Z",
      month: "Feb",
      timeline: 914,
    },
  ]);

  let newLeads: any = {};

  lead.forEach((aLead) => {
    if (newLeads[aLead.leadsource]) {
      newLeads[aLead.leadsource] += 1;
    } else {
      newLeads[aLead.leadsource] = 1;
    }
  });

  let newleads: any[] = Object.keys(newLeads).map((eachLead) => ({
      name: eachLead,
      value: (newLeads[eachLead] / lead.length) * 100,
    })); 

  const updatedNewLeads = newleads.map((item, index) => {
    const newcolor = colors[index];

    return {
      ...item,
      color: newcolor,
    };
  });

  const formatDate = useFormatDate()

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
            className="w-full flex pt-5 px-5 items-start flex-col justify-between filedrop min-h-screen"
          >
            {/* continue here instead */}

            <div className="grid w-full grid-cols-2 gap-6">
              <div className=" p-3  border bg-white rounded-lg border-solid border-#CBCBCB-500">
                <p className="mb-4"> Lead source</p>
                <div
                  className=" flex gap-5 items-center focus:outline-none"
                  tabIndex={-1}
                >
                  <div className="">
                    <PieChart width={200} height={200}>
                      <Pie
                        data={
                          newleads.length
                            ? newleads
                            : [{ name: "No leads", value: 100 }]
                        }
                        dataKey="value"
                        outerRadius={100}
                      >
                        {(newleads.length
                          ? newleads
                          : [{ name: "No Leads", value: 100 }]
                        ).map((entry, index) => (
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
                    {(updatedNewLeads.length
                      ? updatedNewLeads
                      : [{ name: "No Leads", value: 100 }]
                    ).map((item, ii) => {
                      return (
                        <div
                          key={ii}
                          className="flex flex-row gap-4 items-center	"
                        >
                          <div
                            className={`w-2 h-2 rounded-full`}
                            style={{
                              backgroundColor: `${item.color}`,
                            }}
                          >
                            {" "}
                          </div>
                          <p className="">
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
                  <h2> Conversion rate</h2>

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
                    text={String(
                      filteredlead.length > 0 ? filteredlead.length : 0
                    )}
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
                    <p className="text-sm"> {filteredleadsuccess.length}</p>{" "}
                  </div>

                  <div className="flex gap-1">
                    {" "}
                    <p className="font-aeonikregular text-[#425466] text-sm ">
                      {" "}
                      Conversion rate
                    </p>
                    <p className="text-sm">
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

            <TableComponent
              headerName="Leads"
              filters={[
                {
                  key: "leadstatus",
                  options: [
                    { value: "", label: "Status" },
                    {
                      value: "Ongoing",
                      label: "Ongoing",
                    },

                    { label: "New", value: "New" },
                    { label: "No Answer", value: "No Answer" },
                    { label: "Negotiating", value: "Negotiating" },
                    { label: "Unresponsive", value: "Unresponsive" },
                    { label: "Postpone", value: "Postpone" },
                    { label: "Potential", value: "Potential" },

                    {
                      value: "Pending",
                      label: "Pending",
                    },
                    {
                      value: "Not Intrested",
                      label: "Not Intrested",
                    },
                    {
                      value: "Closed [Success]",
                      label: " Success",
                    },
                    {
                      value: "Closed [Failed]",
                      label: "Failed",
                    },
                  ],
                  placeholder: "Status",
                  defaultValue: "",
                },

                {
                  key: "score",
                  options: [
                    { value: "", label: "Score" },
                    { value: "10", label: "10" },
                    { value: "9", label: "9" },
                    { value: "8", label: "8" },
                    { value: "7", label: "7" },
                  ],
                  placeholder: "Score",
                  defaultValue: "",
                },
              ]}
              columns={[
                {
                  key: "author",
                  label: "Name",
                  text: (item: any) =>
                    item.leadfirstname
                      ? `${item.leadfirstname} ${item.leadlastname || ""}`
                      : "N/A",
                  render: (item: any) => (
                    <span
                      className="flex items-center space-x-2"
                      style={{ color: "#262626" }}
                    >
                      <h1 onClick={() => Router.push(`/leads/${item.id}`)}>
                        {item.leadfirstname
                          ? `${item.leadfirstname} ${item.leadlastname || ""}`
                          : "N/A"}
                      </h1>
                    </span>
                  ),
                },
                {
                  key: "email",
                  label: "Email",
                  text: (item: any) => item.leademail || "N/A",
                  render: (item: any) => (
                    <span
                      className="flex items-center space-x-2"
                      style={{ color: "#262626" }}
                    >
                      <h1>{item.leademail || "N/A"}</h1>
                    </span>
                  ),
                },

                {
                  key: "created_at",
                  label: "Date",
                  text: (item: any) =>
                    item.created_at ? formatDate(item.created_at) : "N/A",
                  render: (item: any) => (
                    <span style={{ color: "#262626" }}>
                      {item.created_at ? formatDate(item.created_at) : "N/A"}
                    </span>
                  ),
                },
                {
                  key: "leadstatus",
                  label: "Lead Status",
                  render: (item: any) => (
                    <span style={{ color: "#262626" }}>
                      {item.leadstatus === "Closed [Success]"
                        ? "Success"
                        : item.leadstatus === "Closed [Failed]"
                        ? "Failed"
                        : item.leadstatus || "N/A"}
                    </span>
                  ),
                },
                {
                  key: "action",
                  label: "",
                  render: (item: any) => (
                    <span
                      className="underline"
                      style={{ color: "#262626" }}
                      onClick={() => {
                        Router.push(`/leads/${item.id}`);
                      }}
                    >
                      View
                    </span>
                  ),
                  // Assuming "View" is always available
                },
                // ... add other columns as needed
              ]}
              data={lead}
              isLoading={loading}
              error={error}
              onSelectRow={(item: any) => false}
              hiddenFilters={["score"]}
              showSearchButton={false}
              style={{}}
              multiSelect={true}
              pagination={true}
              onSelectionChange={(selected: any) => setSelectedLeads(selected)}
              actionButtons={
                selectedLeads.length > 0
                  ? [
                      {
                        label: "Delete",
                        action: handleDeleteSelected,
                        className:
                          "bg-[#FFF2F0] text-[#E2341D] text-sm flex items-center space-x-3 py-2 px-3 rounded-md",
                        icon: <FaTrash size={14} />,
                      },
                    ]
                  : []
              }
            />
          </div>
        </>
      }
    </>
  );
};

export default Storage;
