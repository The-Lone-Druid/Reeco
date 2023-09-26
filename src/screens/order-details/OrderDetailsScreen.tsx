import React from "react";
import BreadCrumbs from "../../components/breadcrumbs/BreadCrumbs";
import { Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFindOrderByIdMutation } from "../../services/orders-service/orders.service";
import { useFindCartByIdMutation } from "../../services/carts-service/carts.service";
import { format } from "date-fns";
import { NumericFormat } from "react-number-format";
import { FastfoodOutlined } from "@mui/icons-material";

type Props = {};

const OrderDetailsScreen = (props: Props) => {
  const [orderId, setOrderId] = React.useState<string | undefined>(undefined);
  const [findOrderById, findOrderByIdRes] = useFindOrderByIdMutation();
  const [findCartById, findCartByIdRes] = useFindCartByIdMutation();
  const params = useParams();

  /**
   * To store Order ID from the URL if present
   */
  React.useEffect(() => {
    if (params) {
      setOrderId(params?.orderId);
    }
  }, [params]);

  /**
   * To fetch Order details from the API, Easy to Refetch
   */
  React.useEffect(() => {
    if (orderId) {
      findOrderById(orderId);
    }
  }, [orderId]);

  /**
   * To fetch Cart details from the API, Easy to Refetch
   */
  React.useEffect(() => {
    if (findOrderByIdRes.isSuccess) {
      findCartById(findOrderByIdRes?.data?.card_id);
    }
  }, [findOrderByIdRes.isSuccess]);

  return (
    <div>
      <div className="px-24 bg-white p-2 shadow-md">
        {/* Breadcrumb */}
        <BreadCrumbs />
        {/* Order page header */}
        <div className="flex items-center justify-between mt-4">
          <Typography variant={"h5"} className="!font-bold text-gray-700">
            Order {orderId}
          </Typography>
          <div className="flex items-center gap-4">
            <Button
              variant={"outlined"}
              className={"!rounded-full !normal-case !font-bold !border-2"}
            >
              Back
            </Button>
            <Button
              variant={"contained"}
              className={"!rounded-full !normal-case !font-bold"}
            >
              Approve Order
            </Button>
          </div>
        </div>
      </div>
      <div className="px-24">
        {/* Order Details */}
        <div className="bg-white border-2 rounded-lg p-4 mt-6">
          <div className="grid grid-cols-6 gap-4">
            <div className="px-4 border-r">
              <p className="font-bold text-gray-400 text-sm">Supplier</p>
              <Typography variant="h6" className="!font-bold text-gray-700">
                {findOrderByIdRes?.data?.supplier_details?.supplier_name}
              </Typography>
            </div>
            <div className="px-4 border-r">
              <p className="font-bold text-gray-400 text-sm">Shipping Date</p>
              <Typography variant="h6" className="!font-bold text-gray-700">
                {findOrderByIdRes?.data?.shipping_date &&
                  format(
                    new Date(findOrderByIdRes?.data?.shipping_date),
                    "EE, MMM dd"
                  )}
              </Typography>
            </div>
            <div className="px-4 border-r">
              <p className="font-bold text-gray-400 text-sm">Total</p>
              <Typography variant="h6" className="!font-bold text-gray-700">
                {findOrderByIdRes?.data?.order_total && (
                  <NumericFormat
                    prefix="$ "
                    displayType="text"
                    thousandsGroupStyle="lakh"
                    thousandSeparator=","
                    value={findOrderByIdRes?.data?.order_total}
                  />
                )}
              </Typography>
            </div>
            <div className="px-4 border-r">
              <p className="font-bold text-gray-400 text-sm">Category</p>
              <div className="flex items-center gap-x-5 gap-y-2 flex-wrap mt-2">
                {findOrderByIdRes?.data?.categories?.map((category) => (
                  <FastfoodOutlined className="text-gray-700 !text-xl" />
                ))}
              </div>
            </div>
            <div className="px-4 border-r">
              <p className="font-bold text-gray-400 text-sm">Department</p>
              <Typography variant="h6" className="!font-bold text-gray-700">
                {findOrderByIdRes?.data?.department_id}
              </Typography>
            </div>
            <div className="px-2">
              <p className="font-bold text-gray-400 text-sm">Status</p>
              <Typography variant="h6" className="!font-bold text-gray-700">
                {findOrderByIdRes?.data?.order_status}
              </Typography>
            </div>
          </div>
        </div>
        {/* Cart List (Product Details) */}
        <div className="bg-white border-2 rounded-lg p-4 mt-6"></div>
      </div>
    </div>
  );
};

export default OrderDetailsScreen;
