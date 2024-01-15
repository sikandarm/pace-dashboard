import React, { useEffect, useState } from "react";
import CTextField from "../../components/CTextField/CTextField";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import {
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
  Stack,
  Breadcrumbs,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { HomeRounded } from "@material-ui/icons";

import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import ApiCall from "../../utils/apicall";
import { createBill } from "../../feature/shippinglistSlice";

const AddBill = () => {
  const dispatch = useDispatch();
  const [terms, setTerms] = useState("");
  const [address, setAddress] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [billTitle, setBillTitle] = useState("");
  const [shipVia, setShipVia] = useState("");
  const [bill, setBill] = useState([]);
  const [po, setPo] = useState([]);
  const [company, setCompany] = useState([]);
  const navigate = useNavigate();

  const [selectedCompany, setSelectedCompany] = useState(""); // New state to store the selected company
  const [billItems, setBillItems] = useState([
    {
      purchaseOrderId: "",
      fabricatedItemId: "",
      quantity: "",
    },
  ]);

  useEffect(() => {
    const getItems = async () => {
      const res = await ApiCall.get("/fabricated-items/getall-fabricated-item");
      const uniqueJobIds = new Set();
      const filteredJob = res.data.data.filter((dataItem) => {
        if (!uniqueJobIds.has(dataItem.name)) {
          uniqueJobIds.add(dataItem.name);
          return true;
        }
        return false;
      });
      setBill(filteredJob);
    };
    getItems();
  }, []);

  useEffect(() => {
    const getItems = async () => {
      const res = await ApiCall.get("/purchaseorder");
      setPo(res.data.data.purchaseOrders);
    };
    getItems();
  }, []);

  useEffect(() => {
    const getItems = async () => {
      const res = await ApiCall.get("/company");
      setCompany(res.data.data.companies);
    };
    getItems();
  }, []);

  const handleSubmit = () => {
    if (!billTitle) {
      showErrorToast("Please Enter Bill Title");
      return;
    }
    if (!deliveryDate) {
      showErrorToast("Please Enter Delivery Date");
      return;
    }
    if (!orderDate) {
      showErrorToast("Please Enter Order Date");
      return;
    }
    if (!selectedCompany) {
      showErrorToast("Please Select Company");
      return;
    }

    let validationPassed = true;

    billItems.forEach((item) => {
      if (!item.fabricatedItemId || !item.purchaseOrderId || !item.quantity) {
        showErrorToast("Please fill in all item details");
        validationPassed = false;
      }
    });

    if (!validationPassed) {
      return;
    }

    const billData = {
      billTitle,
      orderDate,
      dilveryDate: deliveryDate,
      terms,
      shipVia,
      address,
      company_id: selectedCompany, // Use the selected company for the entire bill
      bill_of_landing_item: billItems,
    };

    dispatch(createBill(billData)).then((res) => {
      if (res.payload === undefined) {
        const message = "Bill Already Exist!";
        showSuccessToast(message);
      } else {
        const message = "Bill Created Successfully!";
        showSuccessToast(message);
        navigate("/shipping-list");
      }
    });
  };

  const handleAddItem = () => {
    setBillItems([
      ...billItems,
      {
        purchaseOrderId: "",
        fabricatedItemId: "",
        quantity: "",
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...billItems].reverse();
    if (index === 0) {
      showErrorToast("Cannot remove the last field");
      return;
    }
    updatedItems.splice(index - 1, 1);
    setBillItems(updatedItems.reverse());
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...billItems];
    updatedItems[index][field] = value;
    setBillItems(updatedItems);
  };

  return (
    <Container>
      <Helmet>
        <title> Add Bill | Pace Add Bill </title>
      </Helmet>
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
              / Add Bill of Lading
            </Typography>
          </Stack>
        </Breadcrumbs>
      </Stack>

      <Paper elevation={3}>
        <Box p={2}>
          <Grid item xs={12} sm={6}>
            <CTextField
              margin="15px 10px"
              onChange={(event) => {
                setBillTitle(event.target.value);
              }}
              name="billTitle"
              label="Bill Title"
              required={true}
              width="30%"
            />

            <CTextField
              margin="15px 0px"
              onChange={(event) => {
                setTerms(event.target.value);
              }}
              name="terms"
              label="Terms"
              required={true}
              width="30%"
            />
            <CTextField
              margin="15px 10px"
              onChange={(event) => {
                setShipVia(event.target.value);
              }}
              name="shipvia"
              label="Ship Via"
              required={true}
              width="30%"
            />
            <CTextField
              margin="15px 10px"
              onChange={(event) => {
                setDeliveryDate(event.target.value);
              }}
              type="date"
              name="dilverydate"
              label="Delivery Date"
              required={true}
              width="30%"
            />
            <CTextField
              margin="15px 0px"
              onChange={(event) => {
                setOrderDate(event.target.value);
              }}
              type="date"
              name="orderdate"
              label="Order Date"
              required={true}
              width="30%"
            />
            <CTextField
              margin="15px 10px"
              onChange={(event) => {
                setAddress(event.target.value);
              }}
              name="address"
              label="Address"
              required={true}
              width="30%"
            />
            <FormControl
              style={{ width: "30%", marginLeft: "10px", marginBottom: "10px" }}
            >
              <InputLabel htmlFor="select-company">Select Company</InputLabel>
              <Select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                id="select-company"
              >
                <MenuItem value="">
                  <em>Select Company</em>
                </MenuItem>
                {company.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} style={{ marginLeft: "10px" }}>
            {billItems.map((item, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={12} sm={4}>
                  <FormControl style={{ width: "95%" }}>
                    <InputLabel htmlFor={`purchaseOrderId-${index}`}>
                      Select PO
                    </InputLabel>
                    <Select
                      value={item.purchaseOrderId}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "purchaseOrderId",
                          e.target.value
                        )
                      }
                      id={`purchaseOrderId-${index}`}
                    >
                      <MenuItem value="">
                        <em>Select PO Number</em>
                      </MenuItem>
                      {po.map((po) => (
                        <MenuItem key={po.id} value={po.id}>
                          {po.po_number}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl style={{ width: "95%" }}>
                    <InputLabel htmlFor={`fabricatedItemId-${index}`}>
                      Select Fabricated Item
                    </InputLabel>
                    <Select
                      value={item.fabricatedItemId}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "fabricatedItemId",
                          e.target.value
                        )
                      }
                      id={`fabricatedItemId-${index}`}
                    >
                      <MenuItem value="">
                        <em>Select Fabricated Item</em>
                      </MenuItem>
                      {bill.map((fabricatedItem) => (
                        <MenuItem
                          key={fabricatedItem.id}
                          value={fabricatedItem.id}
                        >
                          {fabricatedItem.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CTextField
                    margin="0px 0px"
                    width="95%"
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                    name="quantity"
                    label="Quantity"
                    required={true}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    onClick={() => handleRemoveItem(index)}
                    variant="contained"
                    color="secondary"
                    style={{ margin: "10px 0px", marginLeft: "53rem" }}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}

            {/* Add more items button */}
            <Button onClick={handleAddItem} variant="contained" color="primary">
              Add Item
            </Button>

            {/* Submit button */}
            <Button
              type="submit"
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              Submit
            </Button>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddBill;
