import { KeyboardArrowDown, ShoppingCartOutlined } from "@mui/icons-material";
import { Button, IconButton, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const AppHeader = (props: Props) => {
  const [totalCartItems, setTotalCartItems] = React.useState(2);
  const [menuLinks, setMenuLinks] = React.useState([
    {
      id: 0,
      label: "Store",
      path: "",
    },
    {
      id: 1,
      label: "Orders",
      path: "",
    },
    {
      id: 2,
      label: "Analytics",
      path: "",
    },
  ]);

  return (
    <div className="bg-green-800 p-2 px-24 h-[60px] flex items-center justify-between">
      <div className="flex items-center gap-6">
        {/* Brand logo */}
        <Typography className="!font-bold text-white" variant="h5">
          Reeco
        </Typography>
        {/* Options */}
        <ul className="flex items-center p-0 m-0 gap-6">
          {menuLinks.map((link, key) => (
            <li key={key}>
              <Button className={"!normal-case !text-gray-200"}>
                <Link to={link.path}>{link.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
      {/* User Profile & Cart */}
      <div className="flex items-center gap-6">
        <IconButton className="!text-white relative">
          <div className="absolute top-0 left-0 text-[8px] bg-green-500 h-[18px] w-[18px] rounded-full flex items-center justify-center">
            {totalCartItems}
          </div>
          <ShoppingCartOutlined />
        </IconButton>
        <Button
          className={"!normal-case !text-white"}
          endIcon={<KeyboardArrowDown />}
        >
          Hello, James!
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
