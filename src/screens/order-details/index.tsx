import {
  CheckOutlined,
  CloseOutlined,
  FastfoodOutlined,
  PrintOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import React from "react";
import { NumericFormat } from "react-number-format";
import { useParams } from "react-router-dom";
import { Column } from "react-table";
import { Product, ProductStatus } from "../../@types/carts/carts";
import BreadCrumbs from "../../components/breadcrumbs/BreadCrumbs";
import CartListTable from "../../components/data-tables/CartListTable";
import { useAppDispatch } from "../../hooks/redux.hooks";
import { setTotalCartItems } from "../../redux/slices/cart-slice/cart.slice";
import {
  useFindCartProductsQuery,
  useUpdateProductStatusMutation,
} from "../../services/carts-service/carts.service";
import { useFindOrderByIdMutation } from "../../services/orders-service/orders.service";
import EditItemDialog from "./EditItemDialog";
import MissingItemDialog from "./MissingItemDialog";

type Props = {};

const OrderDetailsScreen = (props: Props) => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [orderId, setOrderId] = React.useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [productTotal, setProductTotal] = React.useState<number>(0);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    React.useState<string>("");
  const [openMissingItemDialog, setOpenMissingItemDialog] =
    React.useState<boolean>(false);
  const [openEditItemDialog, setOpenEditItemDialog] =
    React.useState<boolean>(false);
  const [selectedItem, setSelectedItem] = React.useState<Product | null>(null);
  /**
   * To fetch Order details from the API
   */
  const [findOrderById, findOrderByIdRes] = useFindOrderByIdMutation();

  /**
   * To fetch Cart details from the API
   */
  const findCartProducts = useFindCartProductsQuery({
    query: debouncedSearchTerm || "",
  });

  /**
   * To update the product status
   */
  const [updateProductStatus, updateProductStatusRes] =
    useUpdateProductStatusMutation();

  /**
   * Cart List Table Data
   */
  const [cartListTableData, setCartListTableData] = React.useState<Product[]>(
    []
  );

  /**
   * Cart List Table Columns
   */
  const cartListTableColumns = React.useMemo<Column<Product>[]>(
    () => [
      {
        id: "product_name",
        Header: "Product Name",
        accessor: "product_name",
        Cell: ({ value, row }) => (
          <div className="flex items-center gap-4">
            <img
              src={row?.original?.product_image}
              alt={value}
              className={"max-w-[30px]"}
            />
            <Typography variant={"body2"} className="!font-bold text-gray-700">
              {value}
            </Typography>
          </div>
        ),
      },
      {
        id: "brand",
        Header: "Brand",
        accessor: "brand",
      },
      {
        id: "product_price",
        Header: "Price",
        accessor: "product_price",
        Cell: ({ value, row }) => (
          <>
            <div className="flex items-center gap-1">
              <NumericFormat
                displayType="text"
                prefix="$ "
                thousandSeparator={","}
                thousandsGroupStyle="lakh"
                value={value.toFixed(2)}
              />
              <span>/ {row?.original?.product_unit}</span>
            </div>
            {row?.original?.discounted_price ? (
              <span className={"text-xs text-gray-400 line-through"}>
                <NumericFormat
                  displayType="text"
                  prefix="$ "
                  thousandSeparator={","}
                  thousandsGroupStyle="lakh"
                  value={row?.original?.discounted_price.toFixed(2)}
                />
              </span>
            ) : null}
          </>
        ),
      },
      {
        id: "quantity",
        Header: "Quantity",
        accessor: "quantity",
        Cell: ({ value, row }) => (
          <div className="flex items-center gap-1">
            <span className="font-bold">{value}</span>
            <span className="text-gray-400">
              x {row?.original?.product_unit}
            </span>
          </div>
        ),
      },
      {
        id: "total",
        Header: "Total",
        Cell: ({ value, row }) => (
          <>
            <div>
              <NumericFormat
                displayType="text"
                prefix="$ "
                thousandSeparator={","}
                thousandsGroupStyle="lakh"
                value={(
                  row?.original?.product_price * row?.original?.quantity
                ).toFixed(2)}
              />
            </div>
            {row?.original?.discounted_price ? (
              <span className={"text-xs text-gray-400 line-through"}>
                <NumericFormat
                  displayType="text"
                  prefix="$ "
                  thousandSeparator={","}
                  thousandsGroupStyle="lakh"
                  value={(
                    row?.original?.discounted_price * row?.original?.quantity
                  ).toFixed(2)}
                />
              </span>
            ) : null}
          </>
        ),
      },
      {
        id: "status",
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <div className="flex items-center gap-1">
            {value && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  value === ProductStatus.APPROVED
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {value}
              </span>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        Header: "",
        Cell: ({ value, row }) => (
          <div className={"flex items-center gap-2 justify-end"}>
            <IconButton
              onClick={() => {
                handleApproveItem(row?.original);
                setSelectedItem(row?.original);
              }}
            >
              <CheckOutlined />
            </IconButton>
            <IconButton
              onClick={() => {
                handleMissingItemDialog();
                setSelectedItem(row?.original);
              }}
            >
              <CloseOutlined />
            </IconButton>
            <Button
              onClick={() => {
                handleEditItemDialog();
                setSelectedItem(row?.original);
              }}
              className={"!normal-case"}
            >
              Edit
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  /**
   * Method to handle the Missing Item Dialog
   */
  const handleMissingItemDialog = React.useCallback(() => {
    setOpenMissingItemDialog(!openMissingItemDialog);
  }, [openMissingItemDialog, openEditItemDialog]);

  /**
   * Method to handle the Edit Item Dialog
   */
  const handleEditItemDialog = React.useCallback(() => {
    setOpenEditItemDialog(!openEditItemDialog);
  }, [openMissingItemDialog, openEditItemDialog]);

  /**
   * Method to handle the Approve Item Dialog
   */
  const handleApproveItem = React.useCallback(
    (item: Product) => {
      updateProductStatus({
        id: item?.id,
        cart: {
          ...item,
          status: ProductStatus.APPROVED,
        },
      });
    },
    [findCartProducts.isSuccess]
  );

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
   * To set the cart list data
   */
  React.useEffect(() => {
    if (findCartProducts.isSuccess) {
      findCartProducts.data?.forEach((product) => {
        setProductTotal(
          (prev) => prev + product?.product_price * product?.quantity
        );
      });

      setCartListTableData(findCartProducts.data || []);
      dispatch(setTotalCartItems(findCartProducts.data?.length || 0));
    }

    return () => {
      setProductTotal(0);
    };
  }, [findCartProducts.isSuccess, findCartProducts.data]);

  /**
   * Debounce search term to fetch the cart list
   */
  React.useEffect(() => {
    if (findOrderByIdRes.isSuccess) {
      const timeoutRef = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
        setCartListTableData(findCartProducts.data || []);
        dispatch(setTotalCartItems(findCartProducts.data?.length || 0));
      }, 300);

      return () => clearTimeout(timeoutRef);
    }
  }, [findOrderByIdRes.isSuccess, searchTerm]);

  return (
    <div>
      <div className="px-24 bg-white p-2 shadow-md">
        {/* Breadcrumb */}
        <BreadCrumbs />
        {/* Order page header */}
        <div className="flex items-center justify-between mt-4">
          <Typography variant={"h5"} className="!font-bold text-gray-700">
            Order {findOrderByIdRes?.data?.id}
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
      <div className="px-24 mb-6">
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
                {productTotal && (
                  <NumericFormat
                    prefix="$ "
                    displayType="text"
                    thousandsGroupStyle="lakh"
                    thousandSeparator=","
                    value={productTotal.toFixed()}
                  />
                )}
              </Typography>
            </div>
            <div className="px-4 border-r">
              <p className="font-bold text-gray-400 text-sm">Category</p>
              <div className="flex items-center gap-x-5 gap-y-2 flex-wrap mt-2">
                {findOrderByIdRes?.data?.categories?.map((category, key) => (
                  <FastfoodOutlined
                    key={key}
                    className="text-gray-700 !text-xl"
                  />
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
        <div className="bg-white border-2 rounded-lg p-6 mt-6">
          {/* Table Header */}
          <div className="flex items-center justify-between">
            {/* Search bar */}
            <div>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                label="Search..."
                InputProps={{
                  type: "search",
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            {/* Table Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant={"outlined"}
                className={"!rounded-full !normal-case !font-bold !border-2"}
              >
                Add item
              </Button>
              <IconButton color="primary">
                <PrintOutlined />
              </IconButton>
            </div>
          </div>
          {/* Cart List Table */}
          <div className="mt-6">
            <CartListTable
              columns={cartListTableColumns}
              data={cartListTableData}
            />
          </div>
        </div>
      </div>
      {/* Missing Dialog */}
      <MissingItemDialog
        open={openMissingItemDialog}
        onClose={handleMissingItemDialog}
        selectedItem={selectedItem}
      />
      {/* Edit Dialog */}
      <EditItemDialog
        open={openEditItemDialog}
        onClose={handleEditItemDialog}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default OrderDetailsScreen;
