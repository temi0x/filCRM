import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import logo from "../../../public/images/icon.png"
import Image from "next/image";
import { Line } from "recharts";

const Loader = ({
  text = "",
  fixed = true,
  incLogo = true,
  sx = {},
}: {
  text?: any;
  incLogo?: boolean;
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
      className="h-full left-0 bg-[#26262633] backdrop-blur-[4px] top-0 z-[999999909999999999999999] flex flex-col justify-center items-center w-full"
    >
      {incLogo && (
        <div className="items-center flex justify-center">
          <Image src={logo} alt="Clover" width={90} />
        </div>
      )}

      <Box
        className="text-[#ff5555] h-5 mt-11 justify-center "
        sx={{ display: "flex" }}
      >
        {/* <CircularProgress size={text ? 80 : 60} color="inherit" /> */}
        <LinearProgress variant="indeterminate"  color="inherit" sx={{
          width: 90,
          height: 5,
          borderRadius: 3,
          backgroundColor: "rgba(255, 85, 85, 0.1)",
        }} />
      </Box>

      {text !== "" && (
        <div className="text-[#ff5555ff] text-xl font-bold">{text}</div>
      )}
    </div>
  );
};

export default Loader;
