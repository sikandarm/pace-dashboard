import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ApiCall from "../../utils/apicall";
import { fDate } from "../../utils/formatTime";
import {
  Card,
  ListItem,
  ListItemText,
  Stack,
  Paper,
  Typography,
  Button,
  Grid,
  Breadcrumbs,
  Container,
  TableContainer,
  TableCell,
  Table,
  TableRow,
  TableBody,
} from "@mui/material";
import { HomeRounded } from "@material-ui/icons";

// Utility function to format phone number as (123) 456-7890
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = "+1 ";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return null;
}
function formatfaxNumber(faxNumberString) {
  var cleaned = ("" + faxNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return ["+1", "-", match[2], "-", match[3], "-", match[4]].join("");
  }
  return null;
}

const TABLE_HEAD = [
  { id: "address", label: "Address" },
  { id: "delivery_date", label: "Delivery Date" },
  { id: "confirm_with", label: "Confirm With" },
  { id: "phone", label: "Phone" },
  { id: "order_date", label: "Order Date" },
  { id: "placed_via", label: "Placed Via" },
  { id: "po_number", label: "PO Number" },
  { id: "ship_via", label: "Ship Via" },
  { id: "order_by", label: "Order By" },
  { id: "ship_to", label: "Ship To" },
  { id: "email", label: "Email" },
  { id: "term", label: "Term" },
  { id: "fax", label: "Fax" },
];

const Details = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchaseOrderData = async () => {
      try {
        const response = await ApiCall.get(`/purchaseOrder/${id}`);
        setFormData(response.data.data.purchaseOrder);
        setItems(response.data.data.PurchaseOrderItems);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    if (id) {
      fetchPurchaseOrderData();
    }
  }, [id]);

  const handleBackClick = () => {
    navigate("/PurchaseOrder");
  };

  return (
    <div>
      <Helmet>
        <title>Purchase Order Details | Pace Purchase Order Details</title>
      </Helmet>
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
                / Purchase Order Details
              </Typography>
            </Stack>
          </Breadcrumbs>
        </Stack>
        <Typography variant="h4" style={{ marginBottom: "16px" }}>
          Purchase Order Details
        </Typography>
        <Paper>
          {formData && (
            <Card>
              {TABLE_HEAD.map((column) => (
                <ListItem
                  key={column.id}
                  style={{ borderBottom: "1px solid #e0e0e0" }}
                >
                  <Grid container style={{ marginBottom: "16px" }}>
                    <Grid item xs={6}>
                      <ListItemText primary={column.label} />
                    </Grid>
                    <Grid item xs={6}>
                      {column.id === "delivery_date" ||
                      column.id === "order_date"
                        ? fDate(formData[column.id])
                        : column.id === "phone"
                        ? formatPhoneNumber(formData[column.id])
                        : column.id === "fax"
                        ? formatfaxNumber(formData[column.id])
                        : formData[column.id]}
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </Card>
          )}
        </Paper>
        <Paper style={{ marginTop: "8px" }}>
          <Card>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Items</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableBody>
                {items.map((item) => (
                  <TableBody key={item.id}>
                    <TableRow>
                      <TableCell>{item.Inventory.ediStdNomenclature}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  </TableBody>
                ))}
              </Table>
            </TableContainer>
          </Card>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
            onClick={handleBackClick}
          >
            Back
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default Details;
