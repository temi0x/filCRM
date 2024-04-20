import { Inter } from "next/font/google";
import {  useConnectModal, useAccountModal, useChainModal, } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";


export default function Home() {

  const account = useAccount();

  const router = useRouter();

   const { openConnectModal } = useConnectModal();

   useEffect(() => {
     if (!account.isConnected) openConnectModal?.();
     else router.push("/dashboard");
   }, [openConnectModal, account.isConnected, router]);

  return (
    <>
      <div></div>
    </>
  );
}
