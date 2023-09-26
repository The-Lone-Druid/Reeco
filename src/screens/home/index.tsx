import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const HomeScreen = (props: Props) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate("/orders/32457ABC");
  }, []);

  return <div>HomeScreen</div>;
};

export default HomeScreen;
