import { ChevronRight } from "@mui/icons-material";
import { Breadcrumbs } from "@mui/material";
import { generateBreadcrumbs } from "../../utils";
import Crumb from "./Crumb";

type Props = {};

const BreadCrumbs = (props: Props) => {
  // Call the function to generate the breadcrumbs list
  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRight />}>
      {breadcrumbs.map((crumb, idx) => (
        <Crumb {...crumb} key={idx} last={idx === breadcrumbs.length - 1} />
      ))}
    </Breadcrumbs>
  );
};

export default BreadCrumbs;
