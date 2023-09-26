import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../../../components/headers/AppHeader";

type Props = {};

const AppLayout = (props: Props) => {
  return (
    <div>
      <AppHeader />
      <Outlet />
    </div>
  );
};

export default AppLayout;
