import Image from "next/image";
import { useEffect, useState, useContext, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import logo from "../../../public/images/logo.png";
import io from 'socket.io-client';
import Select from "react-select";
import * as ethers from "ethers";
import { BsFolder, BsList, BsPatchPlusFill, BsPlusLg, BsSendFill, BsTrash } from "react-icons/bs";
import { GrIntegration } from "react-icons/gr";
import { AiOutlineUserAdd } from "react-icons/ai";
import Storage from "../storage";
import {
  LinearProgress,
  TextField,
  IconButton,
  Button,
  Modal,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  Box,
  Tab,
  CircularProgress,
} from "@mui/material";
import cicon from "../../../public/images/icon.png";
import { GenContext } from "../extras/contexts/genContext";
import { FaCloud, FaHome, FaUsers, FaVoteYea } from "react-icons/fa";
import Loader from "../loader";
import {
  useAccount
} from "wagmi";
import { BiSend, BiUser, BiX } from "react-icons/bi";
import {
  store,
  TabPanelProps,
} from "../types";
import Cryptr from "cryptr";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MdCloudUpload } from "react-icons/md";
import { storeFiles } from "../extras/storage/init";

 const sx = {
   "& .Mui-focused.MuiFormLabel-root": {
     color: "#ff5555",
   },
   "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
     borderColor: `#ff5555 !important`,
   },
 };


const TabPanel = (props: TabPanelProps) => {
  const { children, padding, value, index, className = "", ...other } = props;

  const pc = {
    p: padding,
    py: padding !== undefined ? undefined : 2,
  };

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={className} sx={pc}>
          {children}
        </Box>
      )}
    </div>
  );
};

let socket: any;

const Base = ({ children }: { children: JSX.Element[] | JSX.Element }) => {

  const [loginData, setLoginData] = useState<any>({});

  const router = useRouter();

  const pathname = router.pathname.split("/");


  // useEffect(() => {
  //   document
  //     .querySelectorAll("textArea, .emoji-scroll-wrapper")
  //     .forEach((e) => {
  //       e.classList.add("cusscroller");
  //     });

  //   if (localStorage.getItem("cloverlog") === null) {
  //     router.push("/");
  //   } else {
  //     const data = JSON.parse(localStorage.getItem("cloverlog") || "{}");

  //     setLoginData(data);
  //   }
  // }, []);

  const { name, contract, data: main, participants, creator } = loginData;

  /* upload */
  const uploadData = useContext(GenContext);

  const [isLoading, setLoader] = useState(false);

  const [sidebar, setSidebar] = useState<boolean>(false);

  const { isConnected: connected, address } = useAccount();

  const ranOnce = useRef<boolean>(false);

  const initSocket = async () => {

      // await fetch(`/api/groups?lq=${main}`, {
      //   headers: {
      //       Authorization: `Bearer ${localStorage.getItem("clover-x")}`,
      //   }
      // });

      socket = io();
  
      socket.on("connect", () => {
        console.log("connected successfully");
      });

  }

  useEffect(() => {
      if (!connected) {
          // router.push("/logout");
      }
  }, [connected, router])

  useEffect(() => {
      if (!ranOnce.current && main) {

        ranOnce.current = true;

        initSocket();
        
      }
  }, [main]);


  const route = async (path: string, condition?: boolean) => {

    if ((typeof condition !== 'boolean' && pathname.includes(path)) || (typeof condition == 'boolean' && condition)) return;

    // window.location.href = `/dashboard/${path}`;

    await router.push(`/dashboard/${path}`);

  };

  const triggerUpload = async (e: any) => {

      setLoader(true);

      const file = e.target.files[0];

      const progressCallback = (progressEvent: any) => {
        const { loaded, total = 0 } = progressEvent;

        // let percent = Math.floor((loaded * 100) / total);

      };

      const files = await storeFiles(file, progressCallback);
      
      uploadData.updateFile(files);

      router.push("/dashboard/uploads");

      setLoader(false);

  }

  return (
    <>
      {/* {true && <Loader />} */}

      {/* {!isLoading && ( */}
      {true && (
        <div className="app">
          <div className="header border-b-[#eef2f4] h-[80px] w-full border-b-solid border-b flex items-center py-0 px-5">
            <IconButton
              className="!hidden sst:!block"
              onClick={() => setSidebar(!sidebar)}
            >
              {sidebar ? (
                <BsList className="text-[#ff5555] cursor-pointer text-[30px]" />
              ) : (
                <BiX className="text-[#ff5555] cursor-pointer text-[30px]" />
              )}
            </IconButton>

            <div className="logo flex-shrink-0 text-[#ff5555]">
              <Link
                className="text-[#ff5555] cursor-pointer flex pl-4 items-center font-bold text-[18px]"
                href="/"
              >
                <Image src={logo} width={100} height={33.33} alt="filCRM" />
              </Link>
            </div>
            <div className="search-bar h-[80px] z-[3] relative ml-[280px]">
              {/* <input type="text" placeholder="Search..." /> */}
            </div>
            <div className="user-settings flex items-center cursor-pointer flex-shrink-0 ml-auto">
              {/* <div className="dark-light w-[22px] h-[22px] text-[#c1c7cd] flex-shrink-0">
                <FiMoon
                  className="w-full fill-transparent transition-all delay-500"
                  size={24}
                />
              </div> */}
              {/* <div className="settings w-[22px] h-[22px] text-[#c1c7cd] flex-shrink-0">
                <FiSettings
                  className="w-full fill-transparent transition-all delay-500"
                  size={24}
                />
              </div> */}

              {connected && (
                <ConnectButton
                  showBalance={false}
                  accountStatus={{
                    smallScreen: "avatar",
                    largeScreen: "full",
                  }}
                />
              )}

              {/* <div
                onClick={() => router.push("/logout")}
                className="settings text-[14px] hover:text-[#ff5100] text-[#ff5555] min-w-fit"
              >
                Log out
              </div> */}
            </div>
          </div>
          <div className="wrapper w-full flex flex-grow-[1] overflow-hidden">
            <div
              className={`conversation-area bg-white relative flex-col overflow-y-auto overflow-x-hidden w-[280px] srt:!flex flex-shrink-0 border-r-solid border-r border-r-[#eef2f4] cusscroller ${
                sidebar ? "!hidden" : "!flex"
              }`}
            >
              <div
                className={`msg ${
                  pathname.includes("create") && pathname.includes("lead")
                    ? "new"
                    : ""
                }`}
                title="Add More Web3 Leads"
                onClick={() => {
                  if (isLoading) return;

                  const uploader = document?.querySelector(
                    ".input_upload"
                  ) as HTMLElement;

                  uploader?.click();
                }}
              >
                <input
                  type="file"
                  onChange={triggerUpload}
                  className="!hidden input_upload"
                  accept={".csv"}
                  style={{
                    display: "none",
                    visibility: "hidden",
                  }}
                />
                <div className="text-[#ff5555] relative">
                  {isLoading && <div className="spinner"></div>}
                  <div className="w-[44px] min-w-[44px] flex items-center justify-center mr-[15px] rounded-[50%] bg-[#ff5555] h-[44px]">
                    <BsPlusLg size={19} color="#fff" />
                  </div>
                </div>
                <div className="msg-detail w-full">
                  <div className="msg-username">
                    {isLoading ? "Uploading..." : "Create or Upload Leads"}
                  </div>
                  <div className="msg-content">
                    <span className="msg-message">Create or import leads</span>
                  </div>
                </div>
              </div>

              <div
                className={`msg ${
                  ["", "dashboard"].includes([...pathname]?.pop() || "")
                    ? "active"
                    : ""
                }`}
                title="View all leads currently added"
                onClick={() =>
                  route(
                    "",
                    ["", "dashboard"].includes([...pathname]?.pop() || "")
                  )
                }
              >
                <div className="w-[44px] min-w-[44px] flex items-center justify-center mr-[15px] rounded-[50%] bg-[#ff5555] h-[44px]">
                  <FaHome size={19} color="#fff" />
                </div>
                <div className="msg-detail w-full">
                  <div className="msg-username">Overview</div>
                  <div className="msg-content">
                    <span className="msg-message">
                      Your leads and their status
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`msg ${pathname.includes("leads") ? "active" : ""}`}
                title="View all leads currently added"
                onClick={() => route("leads")}
              >
                <div className="w-[44px] min-w-[44px] flex items-center justify-center mr-[15px] rounded-[50%] bg-[#ff5555] h-[44px]">
                  <FaUsers size={19} color="#fff" />
                </div>
                <div className="msg-detail w-full">
                  <div className="msg-username">All Leads</div>
                  <div className="msg-content">
                    <span className="msg-message">
                      View all leads currently added
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`msg ${
                  pathname.includes("uploads") ? "active" : ""
                }`}
                title="View all uploaded lead files"
                onClick={() => route("uploads")}
              >
                <div className="w-[44px] min-w-[44px] flex items-center justify-center mr-[15px] rounded-[50%] bg-[#ff5555] h-[44px]">
                  <MdCloudUpload size={19} color="#fff" />
                </div>
                <div className="msg-detail w-full">
                  <div className="msg-username">Uploads</div>
                  <div className="msg-content">
                    <span className="msg-message">
                      View all uploaded lead files
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`msg ${
                  pathname.includes("integrations") ? "active" : ""
                }`}
                title="Integrations"
                onClick={() => {}}
              >
                <div className="w-[44px] min-w-[44px] flex items-center justify-center mr-[15px] rounded-[50%] bg-[#ff5555] h-[44px]">
                  <GrIntegration size={19} color="#fff" />
                </div>
                <div className="msg-detail w-full">
                  <div className="msg-username">Integrations (Coming soon)</div>
                  <div className="msg-content">
                    <span className="msg-message">
                      CRM Integrations for receiving leads
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`msg active !border-l-transparent`}
                // onClick={async () => await route("storage")}
              >
                <div className="w-[44px] min-w-[44px] flex items-center justify-center mr-[15px] rounded-[50%] bg-[#ff5555] h-[44px]">
                  <FaCloud size={26} color="#fff" />
                </div>
                <div className="msg-detail w-full">
                  <div className="msg-username">Storage Limit</div>
                  <div className="msg-content">
                    <LinearProgress
                      variant="determinate"
                      sx={{
                        height: 6,
                        width: "100%",
                        borderRadius: "5rem",
                        backgroundColor: "#D9D9D9",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#ff5555",
                        },
                      }}
                      value={
                        ((uploadData.fileList?.reduce(
                          (a: number, b: store) => a + b.size, 0
                        ) || 0) /
                          50) *
                        100
                      }
                    />

                    <span className="msg-date text-[13px] min-w-fit ml-[3px]">
                      {(uploadData.fileList
                        ?.reduce((a: number, b: store) => a + b.size, 0) / 1024 || 0).toFixed(2)}
                      /2Gb
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="cusscroller overflow-y-scroll w-full pb-16">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Base;
