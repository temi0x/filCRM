import { useEffect, Suspense, useState } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Base from '../../app/components/base';
import Storage from "../../app/components/storage";

const Dashboard = () => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      


    }, []);

     
    return (
      <>
        <Head>
          <title> Your Leads | filCRM</title>
        </Head>

        <Base>
          <Storage loading={loading} />
        </Base>
      </>
    );

}

export default Dashboard;