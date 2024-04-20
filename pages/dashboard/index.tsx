import { useEffect, Suspense, useState } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Base from '../../app/components/base';
import { useSignMessage } from 'wagmi';
import Loader from '@/app/components/loader';
// import Storage from "../../app/components/storage";

const Dashboard = () => {

    const [loading, setLoading] = useState(true);

    const { signMessageAsync } = useSignMessage();

    const Overview = dynamic(() => import("../../app/components/storage"), {
      ssr: false,
    });


    useEffect(() => {
        (async () => {
          const data = await signMessageAsync({ message: "Welcome to FilCRM" });

          console.log(data, 'sss')

          setLoading(false);
        })();
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