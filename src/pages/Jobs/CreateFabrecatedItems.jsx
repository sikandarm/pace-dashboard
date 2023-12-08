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
} from "@mui/material";
import { HomeRounded } from "@material-ui/icons";
import { Add as AddIcon, Remove as RemoveIcon } from "@material-ui/icons";
import ApiCall from "../../utils/apicall";

const CreateFabrecatedItems = () => {
  const [fields, setFields] = useState([{ name: "", quantity: "" }]);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { fabricateditems } = location.state || {};

  const isUpdateMode = Boolean(fabricateditems);

  useEffect(() => {
    if (isUpdateMode) {
      setFields(fabricateditems);
    }
  }, [isUpdateMode, fabricateditems]);

  const validateDuplicates = (items) => {
    const uniqueItems = new Set();
    const duplicateItems = [];

    for (const item of items) {
      if (uniqueItems.has(item.name)) {
        duplicateItems.push(item.name);
      }
      uniqueItems.add(item.name);
    }

    return duplicateItems;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fields.some((item) => !item.name)) {
      toast.error("Item Name is required for all items", {
        position: "top-right",
      });
      return;
    }

    for (const item of fields) {
      if (item.quantity === "" || isNaN(item.quantity) || item.quantity <= 0) {
        toast.error("Quantity is required and must be a non-negative number", {
          position: "top-right",
        });
        return;
      }
    }

    const duplicateItems = validateDuplicates(fields);

    if (duplicateItems.length > 0) {
      toast.error("Duplicate Items", { position: "top-right" });
      return;
    }

    try {
      const createOrUpdateItems = async () => {
        const promises = fields.map((field) => {
          if (isUpdateMode) {
            // Handle update logic here
            return ApiCall.put(
              `/fabricated-items/update-fabricated-item/${field.id}`,
              {
                name: field.name,
                quantity: field.quantity,
                job_Id: id,
              }
            );
          } else {
            // Handle create logic here
            return ApiCall.post("/fabricated-items/create-fabricated-item", {
              name: field.name,
              quantity: field.quantity,
              job_Id: id,
            });
          }
        });

        try {
          await Promise.all(promises);
          navigate(`/detail-Job/${id}`);
          if (isUpdateMode) {
            showSuccessToast("Items updated successfully");
          } else {
            showSuccessToast("Items created successfully");
          }
        } catch (error) {
          console.error("An error occurred during create/update:", error);
          showErrorToast(error.response?.data?.data || "An error occurred");
        }
      };

      createOrUpdateItems();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleFieldChange = (index, fieldName, value) => {
    const updatedFields = [...fields];
    updatedFields[index][fieldName] = value;
    setFields(updatedFields);
  };

  const handleAddField = () => {
    setFields([...fields, { name: "", quantity: "" }]);
  };

  const handleRemoveField = (index) => {
    if (fields.length === 1) {
      return;
    }
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

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
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <TextField
                      onChange={(event) =>
                        handleFieldChange(index, "name", event.target.value)
                      }
                      name={`name-${index}`}
                      label="Name"
                      //  required={true}
                      value={field.name}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4} style={{ marginBottom: "10px" }}>
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

export default CreateFabrecatedItems;
