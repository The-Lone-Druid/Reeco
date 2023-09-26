import { Breadcrumbs } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import Crumb from "./Crumb";
import { ChevronRight } from "@mui/icons-material";

type Props = {};

const BreadCrumbs = (props: Props) => {
  // Gives us ability to load the current route details
  const location = useLocation();

  function generateBreadcrumbs() {
    const asPathNestedRoutes = location.pathname
      .split("/")
      .filter((v) => v.length > 0);

    const crumblist = asPathNestedRoutes.map((subpath, idx) => {
      const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      const title = subpath;
      const text = title.replace(/-/g, " ");
      return { href, text };
    });

    // Add in a default "Home" crumb for the top-level
    return [...crumblist];
  }

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
