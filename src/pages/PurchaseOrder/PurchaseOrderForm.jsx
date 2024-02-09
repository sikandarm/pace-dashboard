import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  TextField,
  Button,
  Container,
  Select,
  Typography,
  FormControl,
  MenuItem,
  Grid,
  InputLabel,
  Paper,
  Box,
} from "@mui/material";
import ApiCall from "../../utils/apicall";
import { validatePurchaseOrderForm } from "../../utils/PurchaseValidation";

function PurchaseOrderForm() {
  const { id } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    company_id: "",
    delivery_date: "",
    confirm_with: "",
    vendor_id: "",
    userId: "",
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
    status: "",
  });

  const [companies, setCompanies] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [user, setUser] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
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
        const responseCompanies = await ApiCall.get("/company");
        const responseVendors = await ApiCall.get("/vendor");
        const responseUser = await ApiCall.get("/user");
        setCompanies(responseCompanies.data.data.companies);
        setVendors(responseVendors.data.data.vendors);
        setUser(responseUser.data.data.users);
        // Fetch purchase order data
        if (id) {
          const responsePurchaseOrder = await ApiCall.get(
            `/purchaseorder/${id}`
          );
          setFormData(responsePurchaseOrder.data.data.purchaseOrder);
          setIsUpdateMode(true);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    if (!isFormInitialized) {
      setIsFormInitialized(true);
      fetchPurchaseOrderData();
    }
  }, [id, isFormInitialized]);

  const handleSubmit = async (event) => {
    console.log("++++++");
    event.preventDefault();
    setIsSubmitting(true);

    if (!isFormInitialized) {
      setIsSubmitting(false);
      return;
    }

    // console.log(formData, "*********");
    const values = validatePurchaseOrderForm(formData);
    // console.log(values, "+_+_+_+");
    setFormErrors(values.errors);

    try {
      let response;

      if (id) {
        if (Object.keys(values.errors).length === 0) {
          response = await ApiCall.put(`/purchaseorder/${id}`, formData);

          if (response.status === 200 || response.status === 201) {
            // console.log("Data", id ? "Updated" : "Created");
            toast("PurchaseOrder Updated Successfully!");

            navigate("/purchaseorder");
          } else {
            // Handle error
          }
        }
      } else {
        if (Object.keys(values.errors).length === 0) {
          console.log("_______");
          response = await ApiCall.post("/purchaseorder", formData);

          if (response.status === 200 || response.status === 201) {
            // console.log("Data", id ? "Updated" : "Created");
            toast("PurchaseOrder Added Successfully!");
            navigate(
              `/purchaseorderitem/${response.data.data.purchaseOrder.id}`
            );
          } else {
            // Handle error
          }
        }
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
                <FormControl fullWidth>
                  <InputLabel htmlFor="company_id">Select Company</InputLabel>
                  <Select
                    labelId="company_id"
                    name="company_id"
                    value={formData.company_id}
                    onChange={handleChange}
                    error={formErrors.company_id !== undefined}
                    required
                    label="Select Company"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    sx={{ textAlign: "left" }}
                  >
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="delivery_date"
                  label="Delivery Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.delivery_date.toString().split("T")[0]}
                  onChange={handleChange}
                  error={formErrors.delivery_date !== undefined}
                  helperText={formErrors.delivery_date}
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
                  error={formErrors.confirm_with !== undefined}
                  helperText={formErrors.confirm_with}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="vendor_id">Select Vendor</InputLabel>
                  <Select
                    labelId="vendor_id"
                    name="vendor_id"
                    value={formData.vendor_id}
                    onChange={handleChange}
                    error={formErrors.vendor_id !== undefined}
                    label="Select User"
                    required
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    sx={{ textAlign: "left" }}
                  >
                    {vendors.map((vendor) => (
                      <MenuItem key={vendor.id} value={vendor.id}>
                        {vendor.vendor_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="order_date"
                  label="Order Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.order_date.toString().split("T")[0]}
                  onChange={handleChange}
                  error={formErrors.order_date !== undefined}
                  helperText={formErrors.order_date}
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
                  error={formErrors.placed_via !== undefined}
                  helperText={formErrors.placed_via}
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
                  error={formErrors.po_number !== undefined}
                  helperText={formErrors.po_number}
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
                  error={formErrors.ship_via !== undefined}
                  helperText={formErrors.ship_via}
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
                  error={formErrors.order_by !== undefined}
                  helperText={formErrors.order_by}
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
                  error={formErrors.ship_to !== undefined}
                  helperText={formErrors.ship_to}
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
                  error={formErrors.address !== undefined}
                  helperText={formErrors.address}
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
                  error={formErrors.phone !== undefined}
                  helperText={formErrors.phone}
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
                  error={formErrors.email !== undefined}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="term"
                  label="Term"
                  variant="outlined"
                  fullWidth
                  value={formData.term}
                  onChange={handleChange}
                  error={formErrors.term !== undefined}
                  helperText={formErrors.term}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="fax"
                  label="Fax"
                  variant="outlined"
                  fullWidth
                  value={formData.fax}
                  onChange={handleChange}
                  error={formErrors.fax !== undefined}
                  helperText={formErrors.fax}
                />
              </Grid>
              <Grid item xs={2} sm={4}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="userId">Assign To</InputLabel>
                  <Select
                    labelId="vendor_id"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    error={formErrors.userId !== undefined}
                    label="Select User"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    sx={{ textAlign: "left" }}
                  >
                    {user.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.firstName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="status"
                  label="Status"
                  variant="outlined"
                  fullWidth
                  value={formData.status}
                  onChange={handleChange}
                  //  error={formErrors.fax !== undefined}
                  // helperText={formErrors.fax}
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
