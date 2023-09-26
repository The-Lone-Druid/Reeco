import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomeScreen, OrdersScreen } from "../../screens";
import { AppLayout } from "../layouts";
import OrderDetailsScreen from "../../screens/order-details/OrderDetailsScreen";

type Props = {};

const AppRouter = (props: Props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="orders">
            <Route index element={<OrdersScreen />} />
            <Route path=":orderId" element={<OrderDetailsScreen />} />
          </Route>
        </Route>

        {/* Just for Assignment purpose */}
        <Route path="*" element={<Navigate to="/orders/32457ABC" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
