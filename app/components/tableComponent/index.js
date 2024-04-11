import { createRef, useState } from "react";
import CustomSelect from "./customSelectFilter";
import { FiDownloadCloud } from "react-icons/fi";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Tooltip,
  Checkbox,
} from "@mui/material";
import {
  MdArrowDownward,
  MdArrowUpward,
  MdClose,
} from "react-icons/md";
import Dropdown from "./dropdown";
import { BiSearch } from "react-icons/bi";
import toast from "react-hot-toast";
import useFormatDate from "./formatDate";

function TableComponent({
  headerName,
  filters,
  multiSelect = false, // default to false
  onSelectionChange, // new prop
  actionButtons = [], // array of button configurations
  dropdown,
  columns,
  style,
  pagination = true,
  data,
  itemsPerPage: defaultItemsPerPage = 10,
  onSelectRow,
  isLoading,
  error,
  hiddenFilters = [],
  showSearchButton = true,
  exportdata = true,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const [down, setDown] = useState(false);

  const [dExport, setExport] = useState("");

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  const [reverse, setReverse] = useState(false);

  const formatDate = useFormatDate();

  const sx = {
    // border: '1px solid #D0D5DD',
    "&& input": {
      height: `25px`,
      width: `25px`,
      padding: `2px`,
    },
    "&&.Mui-checked": {
      background: "#fff",
    },
    "&&.Mui-checked svg": {
      color: "#ff5555",
      border: "0px solid #D0D5DD",
      // background: '#fff',
    },
    "&& svg": {
      height: `24px`,
      color: "#D0D5DD",
      width: `24px`,
    },
    "&& .MuiTouchRipple-root": {
      borderRadius: "3px",
    },
  };

  const [filtersState, setFiltersState] = useState(
    (filters || []).reduce(
      (acc, filter) => ({
        ...acc,
        [filter.key]: filter.defaultValue || "",
      }),
      {}
    )
  );

  const [search, setSearch] = useState("");

  const arrayToCSV = (arr, delimiter = ",") =>
    arr
      .map((v) =>
        v
          .map((x) => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x))
          .join(delimiter)
      )
      .join("\r\n");

  const handleFilterChange = (key, value) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
  };
  // console.log(filtersState)

  const [selectedItems, setSelectedItems] = useState([]);

  const handleRowSelect = (itemId) => {
    setSelectedItems((prevSelected) => {
      const newSelected = prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId];

      onSelectionChange && onSelectionChange(newSelected); // call the callback with the new selected items
      return newSelected;
    });
  };

  const handleSelectAll = (checked) => {
    setSelectedItems((prevSelected) => {
      const newSelected = checked ? currentItems.map((item) => item.id) : [];
      onSelectionChange && onSelectionChange(newSelected); // call the callback with the new selected items
      return newSelected;
    });
  };

  const inputRef = createRef();

  const filData = (data || []).filter((item) => {
    const filterConditions = (filters || []).every((filter) =>
      filtersState[filter.key]
        ? item[filter.key] === filtersState[filter.key]
        : true
    );

    const searchCondition =
      !search ||
      Object.keys(item).some((itm) => {
        const columnValue = item[itm];

        if (typeof columnValue === "string") {
          return columnValue.toLowerCase().includes(search.toLowerCase());
        }
        return false;
      });

    return filterConditions && searchCondition;
  });

  const filteredData = reverse ? filData.reverse() : filData;

  const startIndex = (currentPage - 1) * defaultItemsPerPage;
  const endIndex = startIndex + defaultItemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  return (
    <div className="mt-14 w-full">
      <div className="flex items-center w-full  justify-between mb-[1.3rem]">
        {headerName && (
          <h1 className="font-aeonikmedium text-[1.125rem]">{headerName}</h1>
        )}
        <div className="flex justify-between    space-x-[1rem]">
          {filters &&
            filters.map(
              (filter) =>
                !hiddenFilters.includes(filter.key) && (
                  <CustomSelect
                    key={filter.key}
                    className={`border-[#D0D5DD] bg-white border ${
                      filter.className || ""
                    }`}
                    value={filtersState[filter.key]}
                    onChange={(val) => handleFilterChange(filter.key, val)}
                    options={filter.options}
                    placeholder={filter.placeholder}
                  />
                )
            )}
          <div className="flex gap-4">
            {dropdown && <div className="table-dropdown">{dropdown}</div>}
            {actionButtons.map((buttonConfig, buttonIndex) => (
              <td key={buttonIndex}>
                <button
                  onClick={() =>
                    buttonConfig.action(selectedItems, () => setSelectedItems)
                  }
                  style={buttonConfig.style}
                  className={buttonConfig.className}
                >
                  {buttonConfig.icon && (
                    <span className="mr-2">{buttonConfig.icon}</span>
                  )}
                  {buttonConfig.label}
                </button>
              </td>
            ))}
            {exportdata && (
              <div
                onClick={() => setDown(true)}
                className="text-[#4E4E4E] border border-[#D0D5DD] cursor-pointer text-sm flex bg-white items-center space-x-3 p-[0.6rem] rounded-md"
              >
                <FiDownloadCloud size={19} />
                <h1>Download </h1>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        style={style}
        className="border-[#f2f2f2]  border pb-4 overflow-hidden rounded-2xl"
      >
        <Modal
          open={down}
          sx={{
            "&& .MuiBackdrop-root": {
              backdropFilter: "blur(5px)",
              width: "calc(100% - 8px)",
            },
          }}
          onClose={() => setDown(false)}
          className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
        >
          <Box
            className="smd:!w-full h-fit m2:px-[2px]"
            sx={{
              minWidth: 300,
              width: "50%",
              maxWidth: 800,
              borderRadius: 6,
              outline: "none",
              p: 4,
              position: "relative",
              margin: "auto",
            }}
          >
            <div className="py-4 px-6 bg-white m-auto -mb-[1px] rounded-t-[.9rem]">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h2 className=" text-[#262626] text-xl !font-aeonikmedium">
                    Export Data
                  </h2>
                  <span className="text-[#5a5a5a] !font-aeonikregular text-sm">
                    Export your table data to excel format.
                  </span>
                </div>
                <Tooltip title="Close" arrow>
                  <IconButton size={"medium"} onClick={() => setDown(false)}>
                    <MdClose
                      size={20}
                      color={"rgb(32,33,36)"}
                      className="cursor-pointer"
                    />
                  </IconButton>
                </Tooltip>
              </div>

              <div className="py-3">
                <label className="text-[#5a5a5a] font-aeonikregular mb-4 text-sm">
                  Export
                </label>

                <Dropdown
                  options={[
                    "Everything",
                    "Based on Date Range",
                    "Based on Filters",
                  ]}
                  value="Select Export Option"
                  style={{
                    width: "100%",
                  }}
                  onSelectedChange={(e) => {
                    switch (e) {
                      case "Based on Filters":
                        setExport("filter");
                        break;

                      case "Based on Date Range":
                        setExport("date");
                        break;

                      default:
                        setExport("all");
                    }
                  }}
                  full
                />
              </div>

              {dExport == "date" && (
                <div className="py-3">
                  <label className="text-[#565656] text-[18px] font-aeonikregular mb-4 font-[600]">
                    Date Range
                  </label>

                  <div className="flex items-center justify-center">
                    <div className="py-3 w-full">
                      <label className="text-[#565656] block font-aeonikregular mb-2 font-[300]">
                        From
                      </label>

                      <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="border border-[#f2f2f2] rounded-md w-[200px] p-2 outline-none"
                      />
                    </div>

                    <div className="py-3 w-full">
                      <label className="text-[#565656] block font-aeonikregular mb-2 font-[300]">
                        To
                      </label>

                      <input
                        type="date"
                        value={to}
                        onChange={(e) => {
                          setTo(e.target.value);
                        }}
                        className="border border-[#f2f2f2] rounded-md w-[200px] p-2 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#ffffff] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
              <div className="flex items-center">
                <Button
                  onClick={() => {
                    if (!dExport) {
                      toast.error("Please select an export option");
                      return;
                    }

                    if (dExport == "date") {
                      if (!to.length && !from.length) {
                        toast.error("At least one date field is required");
                        return;
                      }
                    }

                    let filt = [];

                    if (dExport == "filter") {
                      filt = currentItems.map((z) => {
                        let obj = {};
                        columns.forEach((e) => {
                          obj[e.label] = e.text ? e.text(z) : "N/A";
                        });
                        return Object.values(obj);
                      });
                    } else if (dExport == "date") {
                      const toDate = new Date(to).getTime();

                      const fromDate = new Date(from).getTime();

                      filt = currentItems
                        .filter((ez) => {
                          const date = new Date(ez["created_at"]).getTime();

                          return (
                            from && date >= fromDate && to && date <= toDate
                          );
                        })
                        .map((z) => {
                          let obj = {};
                          columns.forEach((e) => {
                            obj[e.label] = e.text ? e.text(z) : "N/A";
                          });
                          return Object.values(obj);
                        });
                    } else {
                      filt = data.map((z) => {
                        let obj = {};
                        columns.forEach((e) => {
                          obj[e.label] = e.text ? e.text(z) : "N/A";
                        });
                        return Object.values(obj);
                      });
                    }

                    let csvContent = "data:text/csv;charset=utf-8,";

                    filt.unshift([...columns.map((e) => e.label)]);

                    csvContent += arrayToCSV(filt);

                    var encodedUri = encodeURI(csvContent);
                    var link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute(
                      "download",
                      `${headerName || "data"}${
                        dExport == "date"
                          ? `_${
                              from
                                ? `from:${formatDate(from, undefined, true)}`
                                : ""
                            }${
                              to ? `to:${formatDate(to, undefined, true)}` : ""
                            }`
                          : ""
                      }${dExport == "filter" ? "_filtered" : ""}.csv`
                    );
                    document.body.appendChild(link);

                    link.click();
                  }}
                  className="!py-3 !min-w-[220px] !text-sm !px-3 !flex !font-aeonikmedium !items-center !text-[#2D8A39] !fill-white !bg-[#F0FAF0] !normal-case !transition-all !delay-500 !rounded-lg"
                >
                  Export Data
                </Button>
              </div>
            </div>
          </Box>
        </Modal>

        <div className="mb-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {showSearchButton && (
              <div
                onClick={() => inputRef.current.focus()}
                className="rounded-md bg-white flex border border-solid border-[#DAE0E6] items-center w-2/3 min-w-[260px] mx-auto px-2"
              >
                <BiSearch color="#919BA7" size={20} />
                <input
                  type="text"
                  placeholder={`Search ${headerName}`}
                  value={search}
                  ref={inputRef}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border p-1 rounded w-full border-none outline-none text-sm font-aeonikmedium"
                />
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <table className="w-full bg-white border-collapse border-t border-[#f2f2f2]">
          <thead>
            <tr className="border-t border-[#f2f2f2] bg-[#FAFAFB]">
              {multiSelect && (
                <th className="pl-[13px]">
                  <Checkbox
                    onClick={(e) => handleSelectAll(e.target.checked)}
                    className={` 
                     !text-[#D0D5DD] !border-[1px] !p-0 !rounded-[6px]`}
                    sx={sx}
                    checked={selectedItems.length === currentItems.length}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    ...(col.sortable
                      ? {
                          cursor: "pointer",
                        }
                      : {}),
                    ...col.headerStyle,
                  }}
                  className={`text-start font-aeonikregular text-[#8492A6] text-sm py-4 ${
                    multiSelect ? "pr-6" : "px-6"
                  }`}
                >
                  <div
                    onClick={() => setReverse(!reverse)}
                    className="flex items-center space-x-2"
                  >
                    {col.label}
                    {col.sortable ? (
                      !reverse ? (
                        <MdArrowDownward size={17} />
                      ) : (
                        <MdArrowUpward size={17} />
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center px-6 py-4 font-aeonikregular text-sm"
                >
                  Loading...
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center px-6 py-4 font-aeonikregular text-sm text-red-500"
                >
                  Error: {error.message}
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              currentItems.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t border-[#f2f2f2] font-aeonikregular text-[#8492A6] text-xs"
                >
                  {multiSelect && (
                    <td className="py-4 pl-6">
                      <Checkbox
                        className="!text-[#5a5a5a] !p-0  !rounded-[6px]"
                        sx={sx}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleRowSelect(item.id)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-4 cursor-pointer ${
                        multiSelect ? "pr-6" : "px-6"
                      }`}
                      onClick={() => onSelectRow && onSelectRow(item)}
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading && !error && !currentItems.length && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-start px-6 py-4 font-aeonikregular text-sm"
                >
                  No table data available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination && (
          <div className=" mt-6 mx-6 inline-flex justify-end items-center space-x-2 bg-[#fff] border border-[#f2f2f2] py-2 px-3 rounded-full">
            {[
              ...Array(Math.ceil(filteredData.length / defaultItemsPerPage)),
            ].map((_, i) => (
              <button
                key={i}
                className={`border-[#f2f2f2] p-2 flex items-center justify-center text-sm ${
                  currentPage === i + 1
                    ? "bg-gray-200 rounded-full font-aeonikregular h-7 w-7 text-center"
                    : "font-aeonikregular h-7 w-7 text-center"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TableComponent;
