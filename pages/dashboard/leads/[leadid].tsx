import Head from 'next/head';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import Base from '@/app/components/base';
import DisplayAvatar from '@/app/components/avatar';
import { Button, Tooltip } from '@mui/material';
import styles from '@/styles/lead.module.css';
import { RxBorderDotted } from "react-icons/rx";
import WideDropdown from '@/app/components/tableComponent/WideDropdown';
import dayjs from 'dayjs'
import validator from 'validator'
import { FaRegCopy } from 'react-icons/fa';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';

const ViewLead = () => {
    
    const router = useRouter();
    
    const { leadid } = router.query  

    const createRandomLead = () => {
    
        return {
        id: faker.number.int(),
        username: faker.internet.userName(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        status: faker.helpers.arrayElement([
          "Pending",
          "Ongoing",
          "Failed",
          "Success",
        ]),
        destination: faker.location.country(),
        source: faker.helpers.arrayElement([
          "Referrals",
          "Others",
          "Manual entry",
        ]),
        location: faker.location.city(),
        address: faker.finance.ethereumAddress(),
        phone: faker.phone.number(),
        created_at: faker.date.recent(),
        updated_at: faker.date.recent(),
        month: faker.date.month(),
        timeline: faker.number.int(),
      };
    };
    
    const [leads, setLeads] = useState<any[]>(
      faker.helpers.multiple(createRandomLead, {
        count: 25,
      })
    );
    

    const selectedLead = leads[0];

    if (!selectedLead?.status) {
        selectedLead.status = "Pending";
    }

    const [leadStatus, setLeadStatus] = useState<string>('');

    const formatAddr = (addr?: string) => {
          if (!addr) return "";

          return String(addr).substring(0, 4) +
                "..." + String(addr).substring(38, 42);
    }
    
    return (
      <>
        <Head>
          <title>
            {selectedLead.firstname} {selectedLead.lastname} | Lead | filCRM
          </title>
        </Head>

        <Base>
          <div className="px-6 py-9">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4 items-center">
                <DisplayAvatar
                  size={100}
                  options={[
                    {
                      alt: `${selectedLead.firstname} ${selectedLead.lastname}`,
                      src: selectedLead.image,
                    },
                  ]}
                />

                <div className="flex flex-col">
                  <h2 className="text-[20px] font-bold text-[#222]">
                    {selectedLead.firstname} {selectedLead.lastname}
                  </h2>
                  <span className="text-[#656565]">
                    {selectedLead?.email ||
                      formatAddr(selectedLead?.address) ||
                      selectedLead?.mail}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <WideDropdown
                  onSelectedChange={(d: { value: string; label: string }) =>
                    setLeadStatus(d.value)
                  }
                  style={{
                    width: "150px",
                    borderColor: "#4E4E4E",
                  }}
                  altstyle={{
                    width: "fit-content",
                  }}
                  zIndex={10}
                  className="h-full border-[#4E4E4E]"
                  options={[
                    { value: "", label: "Select Status" },
                    { value: "pending", label: "Pending" },
                    { value: "new", label: "New" },
                    { value: "ongoing", label: "Ongoing" },
                    { value: "postpone", label: "Postpone" },
                    { value: "no answer", label: "No Answer" },
                    { value: "negotiating", label: "Negotiating" },
                    { value: "potential", label: "Potential" },
                    { value: "success", label: "Success" },
                    { value: "failed", label: "Failed" },
                  ]}
                />

                <Button className="py-2 px-3 flex space-x-2 items-center cursor-pointer !bg-transparent text-sm border border-[#4E4E4E] border-solid rounded-md text-[#4E4E4E]">
                  {" "}
                  Edit{" "}
                </Button>

                <Button className="!bg-[#FFF2F0] text-[#E2341D] text-sm flex items-center space-x-3 capitalize py-2 px-3 rounded-md h-full border border-solid border-[#E2341D]">
                  Delete
                </Button>
              </div>
            </div>

            <div className="my-8">
              <h3 className="text-[#5c5c5c] font-semibold text-[16px] mb-3">
                Lead Status
              </h3>

              <div
                className={`flex bg-transparent overflow-y-scroll py-1 cusscroller flex-nowrap items-center space-x-4 ${styles.banners}`}
              >
                <button className="w-full py-3 transition-all text-center bg-[#222] font-bold text-[16px] justify-center flex items-center text-white">
                  Pending
                </button>

                <RxBorderDotted
                  size={20}
                  className="text-[#ff5555] min-w-[20px]"
                />

                <button className="w-full py-3 transition-all text-center bg-[#222] font-bold text-[16px] justify-center flex items-center text-white">
                  Ongoing
                </button>

                <RxBorderDotted
                  size={20}
                  className="text-[#ff5555] min-w-[20px]"
                />

                <button className="w-full py-3 transition-all text-center bg-[#222] font-bold text-[16px] justify-center flex items-center text-white">
                  No Answer
                </button>

                <RxBorderDotted
                  size={20}
                  className="text-[#ff5555] min-w-[20px]"
                />

                <button
                  className={`w-full py-3 transition-all text-center bg-[#222] font-bold text-[16px] ${styles.complete} justify-center flex items-center text-white`}
                >
                  Negotiating
                </button>
              </div>
            </div>

              <div
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
                }}
                className="grid gap-4 my-8"
              >
                <div>
                  <h3 className="text-[#5c5c5c] font-semibold text-[16px] mb-3">
                    Lead Details
                  </h3>

                  <div className="infobox flex flex-col border border-[#e5e5e5] border-solid rounded-md bg-white">
                    {(() => {
                      const keys = Object.keys(selectedLead);

                      const parseData = (val: any) => {

                          if (typeof val == 'object') {
                            
                             if (val instanceof Date) {

                                return dayjs(val).format("MMM D, YYYY h:mm A");

                             }else if (val instanceof Array){

                                return val.join(", ");

                             }

                              return val.toString();
                             
                          }else if (validator.isEthereumAddress(String(val))) {

                              return (
                                <CopyToClipboard onCopy={() => {
                                    toast.success("Copied to clipboard");
                                }} text={val}>
                                    <div className="flex cursor-pointer w-fit items-center">
                                    {formatAddr(val)} <FaRegCopy className="ml-2" size={15}/>
                                  </div>
                                  </CopyToClipboard>
                              );

                          }

                          return val;
                      } 

                      return keys.map((key) => {

                         const val = selectedLead[key];

                      
                        
                        if (key === "id") return null;
                        return (
                          <div
                            key={key}
                            className="py-3 px-4 border-b flex w-full border-b-[#e5e5e5] border-solid"
                          >
                            <div className="text-[#919191] w-full capitalize text-[15px]">
                              {key.replace("_", " ")}
                            </div>
                            <div className="text-[#222] w-full capitalize text-[15px]">
                              {parseData(val)}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  

                
                </div>
                </div>

                {/* new tab here */}
              </div>
          </div>
        </Base>
      </>
    );
}

export default ViewLead;