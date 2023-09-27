import { CloseOutlined } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React from "react";
import { Product, ProductStatus } from "../../@types/carts/carts";
import { useUpdateProductStatusMutation } from "../../services/carts-service/carts.service";

type Props = {
  open: boolean;
  onClose: () => void;
  selectedItem: Product | null;
};

const MissingItemDialog = ({ open, onClose, selectedItem }: Props) => {
  const [updateProductStatus, updateProductStatusRes] =
    useUpdateProductStatusMutation();

  const handleUpdateProductStatus = React.useCallback(
    (status: string) => {
      if (selectedItem) {
        updateProductStatus({
          id: selectedItem.id,
          cart: {
            ...selectedItem,
            status,
          },
        });
      }
    },
    [selectedItem]
  );

  React.useEffect(() => {
    if (updateProductStatusRes?.isSuccess) {
      onClose();
    }
  }, [updateProductStatusRes?.isSuccess]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"xs"} fullWidth>
      <DialogTitle
        className="flex items-center justify-between"
        id="alert-dialog-title"
      >
        <span>Missing Product?</span>
        <IconButton onClick={onClose}>
          <CloseOutlined />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          className="!text-gray-700"
        >
          Is "{selectedItem?.product_name}" urgent?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          className={"!normal-case"}
          onClick={() => {
            handleUpdateProductStatus(ProductStatus.MISSING);
          }}
        >
          No
        </Button>
        <Button
          className={"!normal-case"}
          onClick={() => {
            handleUpdateProductStatus(ProductStatus.MISSING_URGENT);
          }}
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MissingItemDialog;
