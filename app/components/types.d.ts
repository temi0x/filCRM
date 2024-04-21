import type { NextApiResponse } from "next";
import type { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";



export type SocketApiResponse = NextApiResponse & {
  socket: {
    server: any;
  };
};


export type cid = string | { iv: string, data: string }

export type store = {
  name: string;
  cid: cid;
  size: number;
};

export interface IndexContextProps {
  isLoading?: boolean;
  bigLoader?: boolean;
  improve?: React.Dispatch<React.SetStateAction<boolean>>;
  registerModal?: React.Dispatch<React.SetStateAction<boolean>>;
  login?: () => Promise<void>;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  className?: string;
  padding?: number;
}

export {}
