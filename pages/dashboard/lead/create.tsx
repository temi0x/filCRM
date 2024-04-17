import Base from "@/app/components/base";
import Head from "next/head";

const CreateLead = () => {
  return (
    <>
      <Head>
        <title>Add New Leads | filCRM</title>
      </Head>

      <Base>
        <div className="px-5">
          <div className="my-2">
            <h2 className="font-bold text-[25px] mt-[14px] mb-3">Create Leads</h2>
          </div>
        </div>
      </Base>
    </>
  );
};

export default CreateLead;
