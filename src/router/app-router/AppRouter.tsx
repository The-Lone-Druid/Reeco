import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomeScreen } from "../../screens";

type Props = {};

const AppRouter = (props: Props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
