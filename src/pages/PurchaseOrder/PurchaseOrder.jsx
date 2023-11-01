import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  Stack,
  TableContainer,
  TableHead,
  Dialog,
  Breadcrumbs,
  MenuItem,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  TextField,
  Typography,
  TableRow,
  Paper,
  Container,
} from "@mui/material";
import Iconify from "../../components/iconify";
import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";
import { HomeRounded } from "@material-ui/icons";
import ApiCall from "../../utils/apicall";
const TABLE_HEAD = [
  { id: "company_name", label: "Company Name", alignRight: false },
  { id: "vendor_name", label: "Vendor Name", alignRight: false },
  { id: "address", label: "Address", alignRight: false },
  { id: "phone", label: "Phone", alignRight: false },
];

export default function PurchaseOrder() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const { loginUser } = useSelector((state) => state.userSlice);
  const { permissions: userPermissions } = loginUser.decodedToken;
  const canAddPurchaseOrder = hasPermission(
    userPermissions,
    PERMISSIONS.ADD_PURCHASE
  );
  const canEditPurchaseOrder = hasPermission(
    userPermissions,
    PERMISSIONS.EDIT_PURCHASE
  );
  const canDeletePurchaseOrder = hasPermission(
    userPermissions,
    PERMISSIONS.DELETE_PURCHASE
  );
  const canViewDetails = hasPermission(
    userPermissions,
    PERMISSIONS.VIEW_PURCHASEDETAIS
  );

  const navigate = useNavigate();

  const fetchPurchaseOrder = async () => {
    try {
      const response = await ApiCall.get("/purchaseOrder");
      const purchaseOrders = response.data.data.purchaseOrders.filter(
        (order) => order.deleted_at === null
      );
      setPurchaseOrders(purchaseOrders);
    } catch (error) {
      // Handle any errors here
    }
  };

  useEffect(() => {
    fetchPurchaseOrder();
  }, [purchaseOrders.id]);

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    if (event.key === "Enter") {
      event.preventDefault();
      //   handleSearch();
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await ApiCall.delete(`/purchaseOrder/${id}`);

      if (response) {
        console.log("Purchase Order deleted successfully");
        // Update the purchaseOrders state by filtering out the deleted item
        setPurchaseOrders((PurchaseOrder) =>
          PurchaseOrder.filter((order) => order.id !== id)
        );
      } else {
        // Handle any errors or validation issues here
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const handleEdit = (id) => {
    navigate(`/PurchaseOrderForm/${id}`);
  };
  const handleDetails = (id) => {
    navigate(`/Details/${id}`);
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      //   handleSearch();
    }
  };

  return (
    <div>
      <Helmet>
        <title>Purchase Order | Pace Purchase Order</title>
      </Helmet>
      <div>
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <Stack direction="row" alignItems="center" spacing={1}>
                <HomeRounded color="inherit" />
                <Typography variant="body1" color="textPrimary">
                  / PurchaseOrder
                </Typography>
              </Stack>
            </Breadcrumbs>
            {canAddPurchaseOrder && (
              <Button
                onClick={() => navigate("/PurchaseOrderForm")}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Purchase Order
              </Button>
            )}
          </Stack>
          <TableContainer component={Paper}>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                label="Search PurchaseOrder.."
                variant="outlined"
                margin="normal"
                value={filterName}
                onChange={handleFilterByName}
                onKeyDown={handleEnterKeyPress}
              />
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  {TABLE_HEAD.map((column) => (
                    <TableCell key={column.id}>{column.label}</TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(purchaseOrders) &&
                  purchaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      {TABLE_HEAD.map((column) => (
                        <TableCell key={column.id}>
                          {order[column.id]}
                        </TableCell>
                      ))}
                      <TableCell align="right" style={{ display: "flex" }}>
                        {canEditPurchaseOrder && (
                          <MenuItem
                            variant="contained"
                            onClick={() => handleEdit(order.id)}
                          >
                            <Iconify icon={"eva:edit-fill"} />
                          </MenuItem>
                        )}
                        {canDeletePurchaseOrder && (
                          <MenuItem
                            sx={{ color: "error.main" }}
                            onClick={() => setSelectedItem(order)}
                          >
                            <Iconify icon={"eva:trash-2-outline"} />
                          </MenuItem>
                        )}
                        {canViewDetails && (
                          <MenuItem
                            sx={{ color: "error.main" }}
                            onClick={() => handleDetails(order.id)}
                          >
                            <Iconify icon={"eva:info-outline"} />
                          </MenuItem>
                        )}
                      </TableCell>
                      <Dialog
                        open={selectedItem !== null}
                        onClose={() => setSelectedItem(null)}
                      >
                        <DialogTitle>Delete Purchase Order</DialogTitle>
                        <DialogContent>
                          <Typography>
                            Are you sure you want to delete Purchase Order{" "}
                            {selectedItem?.company_name}?
                          </Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setSelectedItem(null)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              handleDelete(selectedItem.id);
                              setSelectedItem(null);
                            }}
                            sx={{ color: "error.main" }}
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </div>
    </div>
  );
}
