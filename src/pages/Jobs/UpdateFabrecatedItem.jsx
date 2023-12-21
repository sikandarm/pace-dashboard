import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import {
  Button,
  TextField,
  FormControl,
  IconButton,
  Grid,
  Breadcrumbs,
  Stack,
  Typography,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { HomeRounded } from "@material-ui/icons";
import { Add as AddIcon, Remove as RemoveIcon } from "@material-ui/icons";
import ApiCall from "../../utils/apicall";

const UpdateFabrecatedItem = () => {
  const [fields, setFields] = useState([{ quantity: "", poitems_id: "" }]);
  const [endProduct, setEndProduct] = useState("");
  const [poItems, setPoItems] = useState([]);
  const { id } = useParams();
  console.log(id, "JObID");
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state || {};

  // console.log(item, ")()()()()");
  const isUpdateMode = Boolean(item);

  useEffect(() => {
    if (isUpdateMode) {
      setEndProduct(item?.name || "");
      setFields([
        { quantity: item?.quantity || "", poitems_id: item?.poitems_id || "" },
      ]);
    }
  }, [isUpdateMode, item]);

  const validateDuplicates = (items) => {
    const uniqueItems = new Set();
    const duplicateItems = [];

    for (const item of items) {
      if (uniqueItems.has(item.poitems_id)) {
        duplicateItems.push(item.poitems_id);
      }
      uniqueItems.add(item.poitems_id);
    }

    return duplicateItems;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!endProduct) {
      toast.error("End Product is required", {
        position: "top-right",
      });
      return;
    }

    for (const item of fields) {
      if (
        item.quantity === "" ||
        isNaN(item.quantity) ||
        item.quantity <= 0 ||
        !item.poitems_id
      ) {
        toast.error("Please fill in all fields for each item", {
          position: "top-right",
        });
        return;
      }
    }

    const duplicateItems = validateDuplicates(fields);

    if (duplicateItems.length > 0) {
      toast.error("Duplicate POItems selected", { position: "top-right" });
      return;
    }

    try {
      const createOrUpdateItems = async () => {
        const payload = {
          name: endProduct,
          items: fields,
          job_Id: item.jobid,
          quantity: fields[0]?.quantity,
          poitems_id: fields[0]?.poitems_id,
        };

        if (isUpdateMode) {
          // Handle update logic here
          await ApiCall.put(
            `/fabricated-items/update-fabricated-item/${item?.id}`,
            payload
          );
        }

        if (isUpdateMode) {
          showSuccessToast("Items updated successfully");
          navigate(`/detail-Job/${item.jobid}`);
        }
      };

      createOrUpdateItems();
    } catch (error) {
      console.error("An error occurred:", error);
      showErrorToast(error.response?.data?.data || "An error occurred");
    }
  };

  const handleFieldChange = (index, fieldName, value) => {
    const updatedFields = [...fields];
    updatedFields[index][fieldName] = value;
    setFields(updatedFields);
  };

  const handleAddField = () => {
    setFields([...fields, { quantity: "", poitems_id: "" }]);
  };

  const handleRemoveField = (index) => {
    if (fields.length === 1) {
      return;
    }
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await ApiCall.get(
          `/fabricated-items/get-poitem-perjob/${item.jobid}`
        );
        setPoItems(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItems();
  }, [item.jobid]);

  return (
    <>
      <div>
        <Helmet>
          <title>Fabricated items</title>
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
                  {isUpdateMode
                    ? "/ Update Fabricated Items"
                    : "/ Create Fabricated Items"}
                </Typography>
              </Stack>
            </Breadcrumbs>
          </Stack>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid
                item
                xs={3}
                style={{ marginLeft: "30%", marginBottom: "2%" }}
              >
                <FormControl fullWidth>
                  <TextField
                    onChange={(event) => setEndProduct(event.target.value)}
                    name="endProduct"
                    label="End Product"
                    required
                    value={endProduct}
                  />
                </FormControl>
              </Grid>
            </Grid>
            {fields.map((field, index) => (
              <Grid container spacing={2} alignItems="center" key={index}>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => handleRemoveField(index)}
                    color="secondary"
                  >
                    <RemoveIcon />
                  </IconButton>
                  <IconButton onClick={handleAddField} color="primary">
                    <AddIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={3} style={{ marginBottom: "5px" }}>
                  <FormControl fullWidth>
                    <TextField
                      onChange={(event) =>
                        handleFieldChange(index, "quantity", event.target.value)
                      }
                      name={`quantity-${index}`}
                      label="Quantity"
                      value={field.quantity}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={3} style={{ marginBottom: "5px" }}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor={`label-${index}`}>
                      Select POItems
                    </InputLabel>
                    <Select
                      value={field.poitems_id}
                      onChange={(event) =>
                        handleFieldChange(
                          index,
                          "poitems_id",
                          event.target.value
                        )
                      }
                      id={`label-${index}`}
                    >
                      {poItems.length === 0 && (
                        <MenuItem disabled value="">
                          No Item Found
                        </MenuItem>
                      )}
                      {poItems.map((dataItem) => (
                        <MenuItem key={dataItem.id} value={dataItem.id}>
                          {dataItem.itemName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            ))}
            <Button type="submit" variant="contained" color="primary">
              {isUpdateMode ? "Update" : "Create"}
            </Button>
          </form>
        </container>
      </div>
    </>
  );
};

export default UpdateFabrecatedItem;