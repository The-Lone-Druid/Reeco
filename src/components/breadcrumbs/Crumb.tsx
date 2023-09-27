import { Link } from "react-router-dom";

type Props = {
  text: string;
  href: string;
  last?: boolean;
};

const Crumb = ({ text, href, last = false }: Props) => {
  return (
    <Link
      color="inherit"
      to={""}
      className={`${last ? "underline" : ""} capitalize text-sm !font-bold`}
    >
      {last && "Order "}
      {text}
    </Link>
  );
};

export default Crumb;
