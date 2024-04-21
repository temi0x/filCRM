import { useEffect, Suspense, useState, useRef } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Base from '../../app/components/base';
import { useSignMessage, useDisconnect, useAccount } from 'wagmi';
import Loader from '@/app/components/loader';
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';

const Dashboard = () => {

    const [loading, setLoading] = useState(false);

    const { signMessageAsync } = useSignMessage();

    const once = useRef(true)

    const { disconnectAsync } = useDisconnect();

    const { address } = useAccount();

    const Overview = dynamic(() => import("../../app/components/storage"), {
      ssr: false,
    });


    useEffect(() => {
        if (once.current && !localStorage.getItem("token")) {

        (async () => {
          try {
            once.current = false;
            setLoading(true);
          const data = await signMessageAsync({ message: "Welcome to FilCRM" });

          console.log(data, 'sss')

          if (!data) {
            await disconnectAsync?.();
            toast.error("Please sign message to continue")
            Router.push("/");
          }

          const { data: reqData } = await axios.post("/api/auth/login", { address, hash: data });

          console.log(reqData, 'loginData')

          localStorage.setItem("user", JSON.stringify(reqData.user));

          localStorage.setItem("token", reqData.token);

          setLoading(false);

        } catch (err) {

          const error = err as AxiosError<{ message: string }>;

          console.log(error);

          setLoading(false);

          if (typeof disconnectAsync == 'function') await disconnectAsync();

          toast.error(error?.response?.data?.message || "Something went wrong, please try again")

          Router.push("/");

        }

        })();

      }

    }, []);
     
    return loading ? <Loader /> : (
      <>
        <Head>
          <title>Your Leads | filCRM</title>
        </Head>

        <Base>
          <Overview loading={loading} />
        </Base>
      </>
    );

}

export default Dashboard;