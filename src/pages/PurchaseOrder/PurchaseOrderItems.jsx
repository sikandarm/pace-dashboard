import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  TextField,
  FormControl,
  Select,
  Stack,
  MenuItem,
  Typography,
  Breadcrumbs,
  InputLabel,
  IconButton,
  Grid,
} from "@mui/material";
import { HomeRounded } from "@material-ui/icons";
import { Add as AddIcon, Remove as RemoveIcon } from "@material-ui/icons";
import ApiCall from "../../utils/apicall";
const CreatePurchaseOrderItem = () => {
  const [inventory_id, setInventoryId] = useState("");
  const [quantity, setQuantity] = useState();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [inventoryData, setInventoryData] = useState([]);
  const [items, setItems] = useState([{ inventory_id: "", quantity: 1 }]);
  const { id } = useParams();
  const fetchOrder = async () => {
    try {
      const response = await ApiCall.get("/inventory");
      const data = response.data.data.inventories;
      setInventoryData(data);
    } catch (error) {
      console.error("Error fetching inventory data", error);
    }
  };

  const validateDuplicates = (items) => {
    const uniqueInventoryIds = new Set();
    const duplicateInventoryIds = [];

    for (const item of items) {
      if (uniqueInventoryIds.has(item.inventory_id)) {
        duplicateInventoryIds.push(item.inventory_id);
      }
      uniqueInventoryIds.add(item.inventory_id);
    }

    return duplicateInventoryIds;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const item of items) {
      if (item.quantity === "" || isNaN(item.quantity) || item.quantity <= 0) {
        toast.error("Quantity is required and must be a non-negative number", {
          position: "top-right",
        });
        return;
      }
    }
    if (items.some((item) => !item.inventory_id)) {
      toast.error("Inventory is required for all items", {
        position: "top-right",
      });
      return;
    }
    if (inventoryData.length === 0) {
      toast.error("No inventory data available", { position: "top-right" });
      return;
    }
    const duplicateInventoryIds = validateDuplicates(items);

    if (duplicateInventoryIds.length > 0) {
      toast.error(
        "Duplicate inventory items",
        { position: "top-right" }
      );
      return;
    } else
      try {
        for (const item of items) {
          const { inventory_id, quantity } = item;
          const response = await ApiCall.post("/purchaseorderitem", {
            po_id: id,
            inventory_id,
            quantity,
          });
          if (response.status === 201) {
            console.log("Data saved successfully");
            navigate("/purchaseorder");
          } else {
            console.error("Error saving data");
          }

          // Clear the items array and reset form fields
          setItems([{ inventory_id: "", quantity: 1 }]);
          setInventoryId("");
          setQuantity(1);
          setErrors({}); // Clear any previous validation errors
        }
      } catch (error) {
        // console.error("An error occurred:", error);
      }
  };

  const handleAddItem = () => {
    setItems([...items, { inventory_id, quantity }]);
    setInventoryId("");
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      return;
    }

    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Purchase Order Items | Pace Purchase Order Items</title>
      </Helmet>
      <container>
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
                / PurchaseOrder Items
              </Typography>
            </Stack>
          </Breadcrumbs>
        </Stack>
        <form onSubmit={handleSubmit}>
          {items.map((item, index) => (
            <Grid container spacing={2} alignItems="center" key={index}>
              <Grid item xs={2}>
                <IconButton
                  onClick={() => handleRemoveItem(index)}
                  color="secondary"
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton onClick={handleAddItem} color="primary">
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel htmlFor={`inventory-id-${index}`}>
                    Select Inventory
                  </InputLabel>
                  <Select
                    value={item.inventory_id}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].inventory_id = e.target.value;
                      setItems(updatedItems);
                    }}
                    inputProps={{
                      name: `inventory-${index}`,
                      id: `inventory-id-${index}`,
                    }}
                  >
                    <MenuItem value="">
                      <em>Select an Inventory</em>
                    </MenuItem>
                    {inventoryData.map((dataItem) => (
                      <MenuItem key={dataItem.id} value={dataItem.id}>
                        {dataItem.aiscManualLabel}{" "}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors[index] && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {errors[index].inventory_id}
                  </div>
                )}
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={item.quantity}
                  onChange={(e) => {
                    const updatedItems = [...items];
                    updatedItems[index].quantity = e.target.value;
                    setItems(updatedItems);
                  }}
                />
                {errors[index] && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {errors[index].quantity}
                  </div>
                )}
              </Grid>
            </Grid>
          ))}
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </container>
    </div>
  );
};

export default CreatePurchaseOrderItem;
