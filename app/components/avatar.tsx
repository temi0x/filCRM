import { Avatar, AvatarGroup } from "@mui/material";
import stc from "string-to-color";

type DisplayAvatarProps = {
  options: { alt: string; src?: string }[];
  size?: number,
  max?: number,
  backgroundWhite?: boolean,
}

const DisplayAvatar = ({
  options,
  size,
  max,
  backgroundWhite,
}: DisplayAvatarProps) => {

  const bgcolor = (name: string) =>
    backgroundWhite ? "#ffffff" : stc(`light ${name}`);

  const parseName = (name: string) =>
    name.trim().split(" ").length > 1
      ? name
          .split(" ")
          .map((e) => e.charAt(0))
          .join("")
          .substring(0, 2)
          .replace(/[^^\w\s]/gi, "")
          .toUpperCase()
      : (name || "FL").substring(0, 2).toUpperCase();

  const fontSize = (size || 32) / 2;

  return options.length > 1 ? (
    <div className="relative z-[0]">
      <AvatarGroup
        className="!w-fit"
        sx={{
          "& .MuiAvatar-circular": {
            width: size || 32,
            height: size || 32,
            fontSize,
            fontFamily: "Poppins",
            borderWidth: "3px",
            marginLeft: "-12px",
            position: "relative",
            zIndex: options.length,
          },
        }}
        max={max || 6}
      >
        {options.map((e: { alt: string; src?: string }, i: number) => (
          <Avatar
            key={i}
            alt={e.alt}
            src={e.src}
            sx={{
              width: size || 32,
              height: size || 32,
              bgcolor: bgcolor(parseName(e?.alt)),
              fontSize,
              fontFamily: "Poppins",
              zIndex: `${i} !important`,
            }}
          >
            {parseName(e?.alt)}
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  ) : (
    <Avatar
      alt={options[0].alt}
      src={options[0].src}
      sx={{
        width: size || 32,
        height: size || 32,
        bgcolor: bgcolor(parseName(options[0]?.alt)),
        fontSize,
        fontFamily: "Poppins",
      }}
    >
      {parseName(options[0]?.alt)}
    </Avatar>
  );
};

export default DisplayAvatar;
