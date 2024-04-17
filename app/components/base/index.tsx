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
import {
  beginStorageProvider,
  lq,
  retrieveFiles,
  notifications,
} from "../extras/storage/init";
import { FaCloud, FaHome, FaUsers, FaVoteYea } from "react-icons/fa";
import Loader from "../loader";
import {
  useAccount
} from "wagmi";
import { BiSend, BiUser, BiX } from "react-icons/bi";
import {
  GroupChatType,
  MessageType,
  TextAPIData,
  TabPanelProps,
} from "../types";
import Cryptr from "cryptr";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MdCloudUpload } from "react-icons/md";

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

  const [currentDir, setCurrentDir] = useState<string[]>(["main"]);

  /* upload */
  const uploadData = useContext(GenContext);

  const [update, setUpdate] = useState<boolean>(false);

  const [isLoading, setLoader] = useState(true);

  const [nname, setNname] = useState<string>("");

  const [disparts, setDisparts] = useState<(string | undefined)[]>([]);

  const [toggle, setToggle] = useState<string | number>("0");

  const [discussions, setDiscussion] = useState<string>("");

  const [voteDesc, setVoteDesc] = useState<string>("");

  const [amountAir, setAmountAir] = useState<string | number>('')

  const [sidebar, setSidebar] = useState<boolean>(false);

  const [failMessage, setFailMessage] = useState<string>("");

  const routing = useRef<boolean>(false);

  const [alias, setAlias] = useState<string>('');

  const [aliasError, setAliasError] = useState<string>('')

  const [aliasLoading, setAliasLoading] = useState<boolean>(false);

  const [nameModal, setNameModal] = useState<boolean>(true);

  const [filelist, setFilelist] = useState<number | undefined>();

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

  const [addNew, setAddNew] = useState<boolean>(false);

  return (
    <>
      {/* {true && <Loader />} */}

      {/* {!isLoading && ( */}
      {true && (
        <div className="app">
          {/* <Modal
            open={nameModal}
            sx={{
              "&& .MuiBackdrop-root": {
                backdropFilter: "blur(5px)",
                width: "calc(100% - 8px)",
              },
            }}
            onClose={() => false}
            className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
            aria-labelledby="Alias"
            aria-describedby="We need a username from user"
          >
            <>
              <Box
                className="sm:!w-full 3md:!px-1 h-fit 3mdd:px-[2px]"
                sx={{
                  minWidth: 300,
                  width: "70%",
                  maxWidth: 800,
                  borderRadius: 6,
                  outline: "none",
                  p: 1,
                  position: "relative",
                  margin: "auto",
                }}
              >
                <div className="py-4 px-6 bg-white -mb-[1px] rounded-t-[.9rem]">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.55rem] 3md:text-[1.2rem]">
                        Add Username
                      </h2>
                      <span className="text-[rgb(69,70,73)] font-[500] text-[14px]">
                        Add in a username that would be unique to you
                      </span>
                    </div>
                  </div>

                  <div className="form relative pt-4">
                    <Box sx={{ width: "100%" }}>
                      {Boolean(aliasError.length) && (
                        <div className="rounded-md w-[95%] font-bold mt-2 mx-auto p-3 bg-[#ff8f33] text-white">
                          {aliasError}
                        </div>
                      )}

                      <FormControl
                        fullWidth
                        sx={{
                          px: 2,
                          py: 3,
                        }}
                      >
                        <div>
                          <TextField
                            fullWidth
                            id="outlined-basic"
                            label="Name"
                            sx={sx}
                            variant="outlined"
                            helperText={
                              "Username can only contain alphanumeric characters"
                            }
                            value={alias}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              setAliasError("");
                              setAlias(e.target.value);
                            }}
                          />
                        </div>
                      </FormControl>
                    </Box>
                  </div>
                </div>

                <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
                  <div className="flex items-center">
                    <Button
                      onClick={submitName}
                      className="!py-2 !font-bold !px-3 !capitalize !flex !items-center !text-white !fill-white !bg-[#ff5555] !border !border-solid !border-[#ff5555] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                    >
                      {aliasLoading ? (
                        <>
                          <div className="mr-3 h-[20px] text-[#fff]">
                            <CircularProgress
                              color={"inherit"}
                              className="!w-[20px] !h-[20px]"
                            />
                          </div>{" "}
                          <span>Just a Sec...</span>
                        </>
                      ) : (
                        <>
                          <BiUser
                            color={"inherit"}
                            className={"mr-2 !fill-white"}
                            size={20}
                          />{" "}
                          Submit
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Box>
            </>
          </Modal> */}

          {/* <Modal
            open={addNew}
            sx={{
              "&& .MuiBackdrop-root": {
                backdropFilter: "blur(5px)",
                width: "calc(100% - 8px)",
              },
            }}
            onClose={() => setAddNew(false)}
            className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
            aria-labelledby="Add New to your DAO on Clover"
            aria-describedby="Add New Participants, Discussions, Votes, and more to your DAO on Clover"
          >
            <Box
              className="sm:!w-full 3md:!px-1 h-fit 3mdd:px-[2px]"
              sx={{
                minWidth: 300,
                width: "70%",
                maxWidth: 800,
                borderRadius: 6,
                outline: "none",
                p: 1,
                position: "relative",
                margin: "auto",
              }}
            >
              <div className="py-4 px-6 bg-white -mb-[1px] rounded-t-[.9rem]">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.55rem] 3md:text-[1.2rem]">
                      Add New
                    </h2>
                    <span className="text-[rgb(69,70,73)] font-[500] text-[14px]">
                      Add New Participants, Discussions, Votes, and more to your
                      DAO on Clover
                    </span>
                  </div>

                  <IconButton size={"medium"} onClick={() => setAddNew(false)}>
                    <MdClose
                      size={20}
                      color={"rgb(32,33,36)"}
                      className="cursor-pointer"
                    />
                  </IconButton>
                </div>

                <div className="form relative pt-4">
                  <Box sx={{ width: "100%" }}>
                    {Boolean(failMessage.length) && (
                      <div className="rounded-md w-[95%] font-bold mt-2 mx-auto p-3 bg-[#ff8f33] text-white">
                        {failMessage}
                      </div>
                    )}

                    <FormControl
                      fullWidth
                      sx={{
                        px: 2,
                        py: 3,
                      }}
                    >
                      <div>
                        <ToggleButtonGroup
                          value={toggle}
                          sx={{
                            justifyContent: "space-between",
                            marginBottom: "15px !important",
                            width: "100%",
                            "& .Mui-selected": {
                              backgroundColor: `rgba(94,67,236, 0.8) !important`,
                              color: `#fff !important`,
                            },
                            "& .MuiButtonBase-root:first-of-type": {
                              marginRight: "0px !important",
                              marginLeft: "0px !important",
                            },
                            "& .MuiButtonBase-root": {
                              padding: "10px 15px !important",
                            },
                            "& .MuiToggleButtonGroup-grouped": {
                              borderRadius: "4px !important",
                              minWidth: 241,
                              marginLeft: "5px !important",
                              backgroundColor: "#1212121a",
                              border: "none",
                            },
                          }}
                          exclusive
                          className="w-full cusscroller overflow-y-hidden  mb-4 pb-1"
                          onChange={(e: any) => {
                            if (e.target.value) {
                              setToggle(e.target.value);
                            }
                          }}
                        >
                          <ToggleButton
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: "500",
                            }}
                            value={"0"}
                          >
                            <RiGroupFill className="mr-2" size={20} />
                            Discussion Channel
                          </ToggleButton>
                          <ToggleButton
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: "500",
                            }}
                            value={"1"}
                          >
                            <TbCash className="mr-2" size={20} /> Airdrops
                          </ToggleButton>
                          
                          {contract.toLowerCase() ==
                            "0x74367351f1A6809cED9Cc70654C6BF8c2d1913c9" && (
                            <ToggleButton
                              sx={{
                                textTransform: "capitalize",
                                fontWeight: "500",
                              }}
                              value={"2"}
                            >
                              <AiOutlineUserAdd className="mr-2" size={20} />A
                              New Participant
                            </ToggleButton>
                          )}
                        </ToggleButtonGroup>
                      </div>

                      <TabPanel padding={0} value={Number(toggle)} index={1}>
                        <div className="mb-4">
                          <TextField
                            fullWidth
                            id="outlined-basic"
                            sx={sx}
                            label="Amount (in Crypto)"
                            multiline
                            variant="outlined"
                            value={amountAir}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              const val = e.target.value.replace(/[^0-9.]/g, "");

                              setAmountAir(val);
                              setFailMessage("");
                            }}
                          />
                        </div>

                        <div className="mt-4">
                          <label className="text-[#808080] mb-2 block">
                            Add members
                          </label>

                          <div className="flex w-full items-center cusscroller flex-nowrap overflow-y-hidden overflow-x-scroll">
                            <div
                              onClick={() => {
                                if (disparts.length == participants.length) {
                                  setDisparts([])
                                }else{
                                  setDisparts([...participants]);
                                }
                              }}
                              style={
                                disparts.length == participants.length
                                  ? {
                                      color: "#fff",
                                      backgroundColor: "rgb(24, 144, 255)",
                                    }
                                  : {}
                              }
                              className="truncate cursor-pointer rounded-[4rem] max-w-[200px] hover:max-w-[450px] py-1 px-[10px] font-[500] text-[#444444] delay-500 transition-all border border-solid border-[rgba(0,0,0,0.12)] mx-[3px]"
                            >
                              Everyone
                            </div>

                            {participants.map(
                              (v: string, i: number) =>
                                v.toLowerCase() != address?.toLowerCase() && (
                                  <div
                                    onClick={() => {

                                      const selected = [...disparts];

                                      if (!selected.includes(v)) {
                                        selected.push(v);

                                        setDisparts(selected);
                                      } else {
                                        selected.splice(
                                          selected.indexOf(v),
                                          1
                                        );

                                        setDisparts(selected);

                                      }
                                    }}
                                    style={
                                      disparts.includes(v)
                                        ? {
                                            color: "#fff",
                                            backgroundColor:
                                              "rgb(24, 144, 255)",
                                          }
                                        : {}
                                    }
                                    className="truncate cursor-pointer rounded-[4rem] max-w-[200px] hover:max-w-[450px] py-1 px-[10px] font-[500] text-[#444444] delay-500 transition-all border border-solid border-[rgba(0,0,0,0.12)] mx-[3px]"
                                    key={i}
                                  >
                                    {v}
                                  </div>
                                )
                            )}
                          </div>
                          <span className="text-[14px] block mt-1 text-[#b6b6b6]">
                            Not selecting any item, selects everyone
                          </span>
                        </div>
                      </TabPanel>
                    </FormControl>
                  </Box>
                </div>
              </div>

              <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
                <div className="flex items-center">
                  {(() => {
                    switch (Number(toggle)) {
                      case 0:
                        return (
                          <Button
                            className="!py-2 !font-bold !px-3 !capitalize !flex !items-center !text-white !fill-white !bg-[#ff5555] !border !border-solid !border-[#ff5555] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                          >
                            <BsPatchPlusFill
                              color={"inherit"}
                              className={"mr-2 !fill-white"}
                              size={20}
                            />{" "}
                            Create
                          </Button>
                        );

                    }
                  })()}
                </div>
              </div>
            </Box>
          </Modal> */}

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
                className={`msg ${(pathname.includes("create") && pathname.includes('lead')) ? "new" : ""}`}
                title="Add More Web3 Leads"
                onClick={() => route("lead/create")}
              >
                <div className="w-[44px] min-w-[44px] flex items-center justify-center mr-[15px] rounded-[50%] bg-[#ff5555] h-[44px]">
                  <BsPlusLg size={19} color="#fff" />
                </div>
                <div className="msg-detail w-full">
                  <div className="msg-username">New leads</div>
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
                      value={((filelist || 0) / 50) * 100}
                    />

                    <span className="msg-date text-[13px] min-w-fit ml-[3px]">
                      {filelist?.toFixed(2)}/50Gb
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
