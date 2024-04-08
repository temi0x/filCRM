import { Box, CircularProgress } from "@mui/material";
import logo from "../../../public/images/logo.png"
import Image from "next/image";

const Loader = ({
  text = "",
  fixed = true,
  sx = {},
}: {
  text?: any;
  fixed?: boolean;
  sx?: object;
}) => {
  return (
    <div
      style={{
        position: fixed ? "fixed" : "absolute",
        justifyContent: text ? "space-around" : "center",
        ...sx,
      }}
      className="h-full left-0 bg-[#2626263a] backdrop-blur-[4px] top-0 z-[9999999099999999999999999] flex flex-col justify-center items-center w-full"
    >
      <Box
        className="text-[#ff5555] mt-11 justify-center "
        sx={{ display: "flex" }}
      >
        <CircularProgress size={text ? 80 : 60} color="inherit" />
      </Box>
      {text !== "" && (
        <div className="text-[#ff5555ff] text-xl font-bold">{text}</div>
      )}
    </div>
  );
};

export default Loader;
