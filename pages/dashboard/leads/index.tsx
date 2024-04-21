import Base from "@/app/components/base";
import Head from "next/head";
import { faker } from "@faker-js/faker"
import { useContext, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Router from "next/router";
import useFormatDate from "@/app/components/tableComponent/formatDate";
import TableComponent from "@/app/components/tableComponent";
import { GenContext } from "@/app/components/extras/contexts/genContext";

const Leads = () => {

    const { leads = [] } = useContext(GenContext)


    const [error, setError] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const handleDeleteSelected = () => {

    }

  
    const [selectedLeads, setSelectedLeads] = useState<any[]>([]);

    const formatDate = useFormatDate();

    return (
      <>
        <Head>
          <title>All Leads | filCRM</title>
        </Head>

        <Base>
          <div className="px-5">
            <div className="my-2">
              <h2 className="font-bold text-[25px] mt-[14px] mb-3">
                All Leads
              </h2>
            </div>

            <TableComponent
              headerName=""
              dropdown
              filters={[
                {
                  key: "status",
                  options: [
                    { value: "", label: "Status" },
                    {
                      value: "Ongoing",
                      label: "Ongoing",
                    },
                    { label: "New", value: "New" },
                    { label: "No Answer", value: "No Answer" },
                    { label: "Negotiating", value: "Negotiating" },
                    { label: "Unresponsive", value: "Unresponsive" },
                    { label: "Postpone", value: "Postpone" },
                    { label: "Potential", value: "Potential" },
                    {
                      value: "Pending",
                      label: "Pending",
                    },
                    {
                      value: "Not Intrested",
                      label: "Not Intrested",
                    },
                    {
                      value: "Success",
                      label: " Success",
                    },
                    {
                      value: "Failed",
                      label: "Failed",
                    },
                  ],
                  placeholder: "Status",
                  defaultValue: "",
                },
              ]}
              columns={[
                {
                  key: "author",
                  label: "Name",
                  text: (item: any) =>
                    item.firstname
                      ? `${item.firstname} ${item.lastname || ""}`
                      : "N/A",
                  render: (item: any) => (
                    <span
                      className="flex items-center space-x-2"
                      style={{ color: "#262626" }}
                    >
                      <h1
                        onClick={() =>
                          Router.push(`/dashboard/leads/${item.cid}/${item.id}`)
                        }
                      >
                        {item.firstname
                          ? `${item.firstname} ${item.lastname || ""}`
                          : "N/A"}
                      </h1>
                    </span>
                  ),
                },
                {
                  key: "address",
                  label: "Address",
                  text: (item: any) => item.address || "N/A",
                  render: (item: any) => (
                    <span
                      className="flex items-center space-x-2"
                      style={{ color: "#262626" }}
                    >
                      <h1>
                        {item.address
                          ? String(item.address).substring(0, 4) +
                            "..." +
                            String(item.address).substring(38, 42)
                          : "N/A"}
                      </h1>
                    </span>
                  ),
                },

                {
                  key: "created_at",
                  label: "Date",
                  text: (item: any) =>
                    item.created_at ? formatDate(item.created_at) : "N/A",
                  render: (item: any) => (
                    <span style={{ color: "#262626" }}>
                      {item.created_at ? formatDate(item.created_at) : "N/A"}
                    </span>
                  ),
                },
                {
                  key: "status",
                  label: "Lead Status",
                  render: (item: any) => (
                    <span style={{ color: "#262626" }}>
                      {item.status || "N/A"}
                    </span>
                  ),
                },
                {
                  key: "action",
                  label: "",
                  render: (item: any) => (
                    <span
                      className="underline"
                      style={{ color: "#262626" }}
                      onClick={() => {
                        Router.push(`/dashboard/leads/${item.cid}/${item.id}`);
                      }}
                    >
                      View
                    </span>
                  ),
                  // Assuming "View" is always available
                },
                // ... add other columns as needed
              ]}
              data={leads.sort(
                (a: any, b: any) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )}
              isLoading={loading}
              error={error}
              onSelectRow={(item: any) => false}
              hiddenFilters={["score"]}
              showSearchButton={false}
              style={{}}
              multiSelect={true}
              pagination={true}
              onSelectionChange={(selected: any) => setSelectedLeads(selected)}
              actionButtons={
                selectedLeads.length > 0
                  ? [
                      {
                        label: "Delete",
                        action: handleDeleteSelected,
                        className:
                          "bg-[#FFF2F0] text-[#E2341D] text-sm flex items-center space-x-3 py-2 px-3 rounded-md h-full border border-solid border-[#E2341D]",
                        icon: <FaTrash size={14} />,
                      },
                    ]
                  : []
              }
            />
          </div>
        </Base>
      </>
    );
}

export default Leads