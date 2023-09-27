import { Outlet } from "react-router-dom";
import AppHeader from "../../../components/headers/AppHeader";

type Props = {};

/**
 * Application layout to manage the header, outlet will render the child routes.
 * @param props
 * @returns
 */
const AppLayout = (props: Props) => {
  return (
    <div>
      <AppHeader />
      <Outlet />
    </div>
  );
};

export default AppLayout;
