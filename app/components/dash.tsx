import Head from 'next/head';

function Dash() {
  return (
    <>
      <Head>
        <title>Web 3 CRM | FilCRM</title>
        <meta name="description" content={`
          Web 3 CRM for managing leads and contacts. 
          Built on Filecoin, Polygon, Arbitrum, and Optimism.
        `} />
      </Head>
    </>
  )
}

export default Dash;