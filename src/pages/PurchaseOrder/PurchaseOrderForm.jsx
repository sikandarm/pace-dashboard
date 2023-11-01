import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import ApiCall from "../../utils/apicall";

function PurchaseOrderForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    company_name: "",
    delivery_date: "",
    confirm_with: "",
    vendor_name: "",
    order_date: "",
    placed_via: "",
    po_number: "",
    ship_via: "",
    order_by: "",
    ship_to: "",
    address: "",
    phone: "",
    email: "",
    term: "",
    fax: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchPurchaseOrderData = async () => {
      try {
        const response = await ApiCall.get(`/purchaseOrder/${id}`);
        setFormData(response.data.data.purchaseOrder);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    if (id) {
      setIsUpdateMode(true);
      fetchPurchaseOrderData();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      let response;

      if (id) {
        response = await ApiCall.put(`/purchaseOrder/${id}`, formData);
      } else {
        response = await ApiCall.post("/purchaseOrder", formData);
      }

      if (response.status === 200 || response.status === 201) {
        console.log("Data", id ? "Updated" : "Created");
        navigate("/PurchaseOrder");
      } else {
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Typography variant="h6">Purchase Order Form</Typography>
      <Paper elevation={3}>
        <Box p={2}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="company_name"
                  label="Company Name"
                  variant="outlined"
                  fullWidth
                  value={formData.company_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="delivery_date"
                  label="Delivery Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  value={formData.delivery_date}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="confirm_with"
                  label="Confirm With"
                  variant="outlined"
                  fullWidth
                  value={formData.confirm_with}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="vendor_name"
                  label="Vendor Name"
                  variant="outlined"
                  fullWidth
                  value={formData.vendor_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="order_date"
                  label="Order Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  value={formData.order_date}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="placed_via"
                  label="Placed Via"
                  variant="outlined"
                  fullWidth
                  value={formData.placed_via}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="po_number"
                  label="PO Number"
                  variant="outlined"
                  fullWidth
                  value={formData.po_number}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="ship_via"
                  label="Ship Via"
                  variant="outlined"
                  fullWidth
                  value={formData.ship_via}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="order_by"
                  label="Order By"
                  variant="outlined"
                  fullWidth
                  value={formData.order_by}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="ship_to"
                  label="Ship To"
                  variant="outlined"
                  fullWidth
                  value={formData.ship_to}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Address"
                  variant="outlined"
                  fullWidth
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone"
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="term"
                  label="Term"
                  variant="outlined"
                  fullWidth
                  value={formData.term}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="fax"
                  label="Fax"
                  variant="outlined"
                  fullWidth
                  value={formData.fax}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isUpdateMode
                    ? "Update"
                    : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}

export default PurchaseOrderForm;
