import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/images/logo.png'
import { useAccount } from 'wagmi';

const NotFound = () => {

  const { isConnected } = useAccount(); 

  return (
    <>
      <div className="h-screen">
        <Head>
          <title>Page not found | FilCRM</title>
          <meta name="description" content="404 Not found - FilCRM" />
        </Head>

        <div className="w-full h-fit flex flex-col justify-items-center my-8">
          <div className="items-center flex justify-center">
            <Image src={logo} alt="filCRM" width={150} height={49.995} />
          </div>

          <div className="text-black font-bold text-4xl mx-auto mt-24">
            Page not found
          </div>
          <div className="text-[#ff5555] font-semibold text-lg mx-auto mt-12">
            Click this button, and go home
          </div>
          <div className="mx-auto mt-8">
            <Link href={isConnected ? "/dashboard" : "/"}>
              <button className="ml-2 hover:bg-[#d52323] transition-all delay-500 text-sm rounded-lg bg-[#ff5555] text-white font-semibold py-4 px-4 mx-auto">
                Take Me Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;