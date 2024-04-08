import Image from "next/image";
import { useEffect, useState, useContext, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import logo from "../../../public/images/logo.png";
import io from 'socket.io-client';
import Select from "react-select";
import { RiGroupFill } from "react-icons/ri";
import * as ethers from "ethers";
import { BsFolder, BsList, BsPatchPlusFill, BsPlusLg, BsSendFill, BsTrash } from "react-icons/bs";
import { AiOutlineUserAdd } from "react-icons/ai";
import {
  FiImage,
  FiSettings,
  FiMoon,
  FiPaperclip,
  FiPlusCircle,
  FiVideo,
  FiLogOut,
  FiX,
  FiEdit3,
} from "react-icons/fi";
import Storage from "../storage";
import { MdClose, MdMeetingRoom, MdOutlineEmojiEmotions } from "react-icons/md";
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
import { FaCloud, FaVoteYea } from "react-icons/fa";
import Loader from "../loader";
import {
  useAccount
} from "wagmi";
import { BiSend, BiUser, BiX } from "react-icons/bi";
import { GroupChatType, MessageType, TextAPIData } from "../types";
import Cryptr from "cryptr";
import axios, { AxiosError } from "axios";
import { TbCash } from "react-icons/tb";
import toast from "react-hot-toast";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  className?: string;
  padding?: number;
}

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

  const [sidebar, setSidebar] = useState<boolean>(false);

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
      if (!ranOnce.current && main) {

        ranOnce.current = true;

        initSocket();
        
      }
  }, [main]);


  useEffect(() => {
    async function init() {

      await beginStorageProvider({
        user: address || "",
        contract,
        randId: main,
        participants,
      });

      const { data: { user } } = await axios.get('/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clover-x')}`
        }
      });

      if (user.name) setNameModal(false);

      const flist = await retrieveFiles();


      let tSize = 0;

      flist.forEach((e: any) => {
        tSize += e.size;
      });

      setFilelist(tSize / 1_073_741_824);



      if (pathname[pathname.length - 1] == "dashboard") {
        document.querySelector(".msg.active")?.scrollIntoView();
      }


      if (!routing.current) setLoader(false);
      
    }

    if (name != undefined) {
      init();
    }
  }, [
    main,
    currentDir,
    uploadData,
    update,
    contract,
    name,
    address,
    participants
  ]);

  const submitName = async () => {
      if (aliasLoading) return;

      setAliasLoading(true);

      if (!alias.length) { 
        setAliasError("Your name is required");
        setAliasLoading(false);
        return;
      }

      try {

      const { data: { user } } = await axios.patch('/user', { name: alias }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clover-x')}`
        }
      });

      localStorage.setItem("cloveruser", JSON.stringify(user));

      setAliasLoading(false);

      setNameModal(false)
    
    }catch (err) {

        const error = err as any

        setAliasLoading(false)        

        setAliasError(error?.response?.data.message || "")

    }

  };

  const route = async (path: string) => {
    if (pathname.includes(path)) return;

    // window.location.href = `/dashboard/${path}`;

    await router.push(`/dashboard/${path}`);

  };

  const [addNew, setAddNew] = useState<boolean>(false);

  return (
    <>
      {/* {isLoading && <Loader />} */}

      {/* {!isLoading && ( */}
      {true && (
        <div className="app">
        <div className="header h-[80px] w-full flex items-center py-0 px-5">
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
              <div
                onClick={() => router.push("/logout")}
                className="settings text-[14px] hover:text-[#ff5100] text-[#e2e2e2] min-w-fit"
              >
                Log out
              </div>
            </div>
          </div>
          <div className="wrapper w-full flex flex-grow-[1] overflow-hidden">
            {/* continue here */}

            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Base;
