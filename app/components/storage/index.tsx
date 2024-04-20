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
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { PieChart, Cell, Pie } from "recharts";
import empty from "../../../public/images/empty.png";
import { FaTrash, FaRegClock } from "react-icons/fa";
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
import io from 'socket.io-client';
import TableComponent from "../../components/tableComponent";
import useFormatDate from "../tableComponent/formatDate";
import { faker } from "@faker-js/faker";

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

  const createRandomLead = () => {
      return {
         id: faker.number.int(),
         username: faker.internet.userName(),
         firstname: faker.person.firstName(),
         lastname: faker.person.lastName(),
         status: faker.helpers.arrayElement(["Pending", "Ongoing", "Failed", "Success"]),
         destination: faker.location.country(),
         source: faker.helpers.arrayElement(["Referrals", "Others", "Manual entry"]),
         location: faker.location.city(),
         address: faker.finance.ethereumAddress(),
         phone: faker.phone.number(),
         created_at: faker.date.recent(),
         updated_at: faker.date.recent(),
         month: faker.date.month(),
         timeline: faker.number.int()
      }
  }

  const [lead, setLead] = useState<any[]>(faker.helpers.multiple(createRandomLead, {
    count: 25  
  }));



  let newLeads: any = {};

  lead.forEach((aLead) => {
    if (newLeads[aLead.source]) {
      newLeads[aLead.source] += 1;
    } else {
      newLeads[aLead.source] = 1;
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
    return item.status === "Success";
  });

  const progressbarvalue = (filteredlead.length / lead.length) * 100;

  const filteredleadsuccess = lead.filter(
    (item) => item.status === "Success"
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
                      text: {
                        fill: "black",
                        fontSize: "12px",
                        transform: " translate(3px, -5px) rotate(90deg)",
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
              headerName="Latest Leads"
              dropdown
              filters={[
                {
                  key: "status",
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
                      value: "Success",
                      label: " Success",
                    },
                    {
                      value: "Failed",
                      label: "Failed",
                    },
                  ],
                  placeholder: "Status",
                  defaultValue: "",
                },
              ]}
              columns={[
                {
                  key: "author",
                  label: "Name",
                  text: (item: any) =>
                    item.firstname
                      ? `${item.firstname} ${item.lastname || ""}`
                      : "N/A",
                  render: (item: any) => (
                    <span
                      className="flex items-center space-x-2"
                      style={{ color: "#262626" }}
                    >
                      <h1
                        onClick={() =>
                          Router.push(`/dashboard/leads/${item.id}`)
                        }
                      >
                        {item.firstname
                          ? `${item.firstname} ${item.lastname || ""}`
                          : "N/A"}
                      </h1>
                    </span>
                  ),
                },
                {
                  key: "address",
                  label: "Address",
                  text: (item: any) => item.address || "N/A",
                  render: (item: any) => (
                    <span
                      className="flex items-center space-x-2"
                      style={{ color: "#262626" }}
                    >
                      <h1>
                        {item.address
                          ? String(item.address).substring(0, 4) +
                            "..." +
                            String(item.address).substring(38, 42)
                          : "N/A"}
                      </h1>
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
                  key: "status",
                  label: "Lead Status",
                  render: (item: any) => (
                    <span style={{ color: "#262626" }}>
                      {item.status || "N/A"}
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
                        Router.push(`/dashboard/leads/${item.id}`);
                      }}
                    >
                      View
                    </span>
                  ),
                  // Assuming "View" is always available
                },
                // ... add other columns as needed
              ]}
              data={lead.sort(
                (a: any, b: any) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )}
              isLoading={loading}
              error={error}
              onSelectRow={(item: any) => false}
              hiddenFilters={["score"]}
              showSearchButton={false}
              style={{}}
              multiSelect={true}
              pagination={false}
              onSelectionChange={(selected: any) => setSelectedLeads(selected)}
              actionButtons={
                selectedLeads.length > 0
                  ? [
                      {
                        label: "Delete",
                        action: handleDeleteSelected,
                        className:
                          "bg-[#FFF2F0] text-[#E2341D] text-sm flex items-center space-x-3 py-2 px-3 rounded-md h-full border border-solid border-[#E2341D]",
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
