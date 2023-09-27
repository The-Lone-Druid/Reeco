import {
  AddOutlined,
  CheckOutlined,
  CloseOutlined,
  RemoveOutlined,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { useFormik } from "formik";
import React from "react";
import { NumericFormat } from "react-number-format";
import * as Yup from "yup";
import { Product } from "../../@types/carts/carts";
import { useUpdateProductStatusMutation } from "../../services/carts-service/carts.service";

type Props = {
  open: boolean;
  onClose: () => void;
  selectedItem: Product | null;
};

const EditItemDialog = ({ open, onClose, selectedItem }: Props) => {
  const [updateProductStatus] = useUpdateProductStatusMutation();
  const [cancellationReasons] = React.useState([
    {
      id: 0,
      label: "Missing Product",
    },
    {
      id: 1,
      label: "Quantity is not the same",
    },
    {
      id: 2,
      label: "Price is not the same",
    },
    {
      id: 3,
      label: "Other",
    },
  ]);

  const editItemForm = useFormik({
    initialValues: {
      id: 0,
      product_name: "",
      product_price: 0,
      product_image: "",
      brand: "",
      status: "",
      quantity: 0,
      discounted_price: 0,
      product_unit: "",
    },
    validationSchema: Yup.object({
      product_price: Yup.number()
        .min(1, "Please enter price")
        .required("Price is required"),
      quantity: Yup.number()
        .min(1, "Please enter quantity")
        .required("Quantity is required"),
    }),
    onSubmit: (values) => {
      handleUpdateProductStatus(values);
    },
  });

  const handleUpdateProductStatus = React.useCallback(
    (cart: typeof editItemForm.values) => {
      if (selectedItem) {
        updateProductStatus({
          id: selectedItem.id,
          cart,
        })
          .unwrap()
          .then(() => {
            onClose();
          });
      }
    },
    [selectedItem]
  );

  React.useEffect(() => {
    if (selectedItem) {
      editItemForm.setValues(selectedItem);
    }
  }, [selectedItem]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"sm"} fullWidth>
      <div className="flex items-center justify-end pr-2 pt-2">
        <IconButton onClick={onClose}>
          <CloseOutlined />
        </IconButton>
      </div>
      <DialogTitle id="alert-dialog-title" className="!pt-0 truncate">
        <span className="block !font-bold">{selectedItem?.product_name}</span>
        <span className="block !text-gray-500 !text-lg">
          {selectedItem?.brand}
        </span>
      </DialogTitle>
      <DialogContent>
        <div>
          <form
            onSubmit={editItemForm.handleSubmit}
            className="flex items-center gap-6"
          >
            <div>
              <img
                src={selectedItem?.product_image}
                className="max-w-[150px]"
                alt=""
              />
            </div>
            <div className="w-full">
              <table>
                <tbody>
                  <tr>
                    <td className={"p-1 !whitespace-nowrap"}>Price ($)</td>
                    <td className={"p-1 w-full"}>
                      <div className="flex items-center justify-center">
                        <div className="relative flex items-center">
                          <NumericFormat
                            displayType="input"
                            thousandSeparator={true}
                            id="product_price"
                            name="product_price"
                            value={editItemForm.values.product_price}
                            onChange={(event) => {
                              const value = event.target.value;
                              editItemForm.setFieldValue(
                                "product_price",
                                parseFloat(value.replace("$", ""))
                              );
                            }}
                            onBlur={editItemForm.handleBlur}
                            prefix="$"
                            className="!text-gray-700 border p-2 rounded-lg w-[100px] text-center"
                          />
                          <div className="absolute right-[-60px]">
                            <span className="text-sm ml-1">
                              {" "}
                              / {selectedItem?.product_unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className={"p-1 !whitespace-nowrap"}>Quantity</td>
                    <td className={"p-1 w-full"}>
                      <div className="flex items-center justify-center">
                        <div className="relative flex items-center">
                          <div className="absolute left-[-50px]">
                            <IconButton
                              size="small"
                              sx={{
                                backgroundColor: green[500],
                                color: "white",
                                "&:hover, &.Mui-focusVisible": {
                                  backgroundColor: green[500],
                                  color: "white",
                                },
                              }}
                              onClick={() => {
                                if (editItemForm.values.quantity <= 1) return;

                                editItemForm.setFieldValue(
                                  "quantity",
                                  parseFloat(
                                    editItemForm.values.quantity.toString()
                                  ) - 1
                                );
                              }}
                            >
                              <RemoveOutlined />
                            </IconButton>
                          </div>
                          <div className="absolute right-[-110px]">
                            <IconButton
                              size="small"
                              sx={{
                                backgroundColor: green[500],
                                color: "white",
                                "&:hover, &.Mui-focusVisible": {
                                  backgroundColor: green[500],
                                  color: "white",
                                },
                              }}
                              onClick={() => {
                                editItemForm.setFieldValue(
                                  "quantity",
                                  parseFloat(
                                    editItemForm.values.quantity.toString()
                                  ) + 1
                                );
                              }}
                            >
                              <AddOutlined />
                            </IconButton>
                            <span className="text-sm ml-1">
                              {" "}
                              / {selectedItem?.product_unit}
                            </span>
                          </div>
                          <NumericFormat
                            displayType="input"
                            thousandSeparator={true}
                            id="quantity"
                            name="quantity"
                            value={editItemForm.values.quantity}
                            onChange={editItemForm.handleChange}
                            onBlur={editItemForm.handleBlur}
                            className="!text-gray-700 border p-2 rounded-lg w-[100px] text-center"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className={"p-1 !whitespace-nowrap"}>Total</td>
                    <td className={"p-2 w-full"}>
                      <div className="flex items-center justify-center">
                        {" "}
                        <NumericFormat
                          displayType="text"
                          thousandSeparator={true}
                          value={(
                            editItemForm.values?.product_price *
                            editItemForm.values?.quantity
                          ).toFixed(2)}
                          prefix="$"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
          {/* Reason */}
          <div className="mt-4">
            <Typography variant={"body2"} className="!font-bold">
              Choose Reason{" "}
              <span className="text-gray-300 !font-normal !text-xs ml-1">
                (Optional)
              </span>
            </Typography>
            <div className="mt-4">
              <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
                {cancellationReasons.map((reason, key) => (
                  <Button
                    key={key}
                    variant={
                      editItemForm.values.status === reason.label
                        ? "contained"
                        : "outlined"
                    }
                    className="!rounded-full !normal-case !text-xs !border-gray-300 flex items-center gap-2"
                    onClick={() => {
                      editItemForm.setFieldValue("status", reason.label);
                    }}
                  >
                    {editItemForm.values.status === reason.label ? (
                      <CheckOutlined className={"!text-lg"} />
                    ) : null}
                    {reason?.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          className={"!normal-case"}
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant={"contained"}
          className={"!rounded-full !normal-case !font-bold"}
          onClick={() => {
            editItemForm.submitForm();
          }}
          autoFocus
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItemDialog;
