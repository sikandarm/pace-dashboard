import React, { useState, useEffect } from "react";
import ApiCall from "../../utils/apicall";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  Container,
  Table,
  TableHead,
  Typography,
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  DialogActions,
  TableCell,
  MenuItem,
  Breadcrumbs,
  TableRow,
  TablePagination,
  Stack,
  Button,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";
import { HomeRounded } from "@material-ui/icons";
import Iconify from "../../components/iconify";

const TABLE_HEAD = [{ id: "vendor_name", label: "Name", alignRight: false }];

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const { loginUser } = useSelector((state) => state.userSlice);
  const { permissions: userPermissions } = loginUser.decodedToken;
  const canAddVendor = hasPermission(userPermissions, PERMISSIONS.ADD_VENDOR);
  const canEditVendor = hasPermission(userPermissions, PERMISSIONS.Edit_VENDOR);
  const canDeleteVendor = hasPermission(
    userPermissions,
    PERMISSIONS.Delete_VENDOR
  );
  const fetchVendors = async () => {
    try {
      const response = await ApiCall.get("/vendor");
      setVendors(response.data.data.vendors);
      setSearchResults(response.data.data.vendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const [formErrors, setFormErrors] = useState({
    vendor_name: "",
  });

  const vendorNameRegex = /^[A-Za-z -]+$/;

  const [newVendorData, setNewVendorData] = useState({
    vendor_name: "",
  });
  const handleAddVendorSubmit = async () => {
    if (!newVendorData.vendor_name.trim()) {
      setFormErrors({
        vendor_name: "Vendor Name is required",
      });
      return;
    }
    if (!vendorNameRegex.test(newVendorData.vendor_name.trim())) {
      setFormErrors({
        vendor_name: "Invalid characters in Vendor Name",
      });
      return;
    }

    try {
      const response = await ApiCall.post("/vendor", newVendorData);
      // console.log("Vendor added successfully:", response.data.data.vendors);
      if (response) {
        fetchVendors();
        setNewVendorData({ vendor_name: "" });
        setFormErrors({
          vendor_name: "",
        });
        handleClose();
      }
    } catch (error) {
      console.error("Error adding vendor:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleEdit = (vendorId) => {
    const selectedVendor = vendors.find((vendor) => vendor.id === vendorId);
    setSelectedItem(selectedVendor);
    setNewVendorData({
      vendor_name: selectedVendor.vendor_name,
    });
    setOpenUpdateModel(true);
  };
  const handleUpdateVendorSubmit = async () => {
    if (!newVendorData.vendor_name.trim()) {
      setFormErrors({
        vendor_name: "Vendor Name is required",
      });
      return;
    }

    if (!vendorNameRegex.test(newVendorData.vendor_name.trim())) {
      setFormErrors({
        vendor_name: "Invalid characters in Vendor Name",
      });
      return;
    }

    try {
      const response = await ApiCall.put(
        `/vendor/${selectedItem.id}`,
        newVendorData
      );
      if (response.status === 200) {
        fetchVendors();
        var updatedVendor = response.data.data.vendor;
        var updatedVendors = vendors.map((vendor) =>
          vendor.id === updatedVendor.id ? updatedVendor : vendor
        );
        setNewVendorData(updatedVendors);
        setFormErrors({
          vendor_name: "",
        });
        console.log("Vendor updated successfully:", response.data);
        setOpenUpdateModel(false);
      } else {
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
    }
  };

  const handleDelete = async (vendorId) => {
    try {
      // Perform API call to mark the vendor as deleted in the backend
      await ApiCall.delete(`/vendor/${vendorId}`);

      // Fetch the updated vendors from the backend after deletion
      await fetchVendors();

      console.log("Vendor marked as deleted successfully");
    } catch (error) {
      console.error("Error marking vendor as deleted:", error);
    }
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = async () => {
    try {
      const response = await ApiCall.get("/vendor", {
        params: {
          vendor_name: filterName,
        },
      });
      setSearchResults(response.data.data.vendors);
    } catch (error) {}
  };
  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await ApiCall.get("/vendor", {
          params: {
            vendor_name: filterName,
          },
        });
        setSearchResults(response.data.data.vendors);
      } catch (error) {}
    };
    handleSearch();
  }, [filterName]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - searchResults.length) : 0;
  const isNotFound = !searchResults.length && !!filterName;

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await ApiCall.get("/vendor", {
          params: {
            page: page + 1,
          },
        });
        setVendors(response.data.data.vendors);
      } catch (error) {
        console.log("err", error);
      }
    };
    fetchPage();
  }, [page]);

  const handleClose = () => {
    setFormErrors("");
    setOpenUpdateModel(false);
    setOpen(false);
  };
  const handleOpenModel = () => {
    setOpen(true);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Vendors | Pace Vendors</title>
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
                  / Vendors
                </Typography>
              </Stack>
            </Breadcrumbs>
            {canAddVendor && (
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleOpenModel}
              >
                Add New Vendor
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
                label="Search Vendors.."
                variant="outlined"
                margin="normal"
                value={filterName}
                onChange={handleFilterByName}
                onKeyDown={handleEnterKeyPress}
              />
              <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                count={vendors.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
            <Table>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Vendor</DialogTitle>
                <DialogContent>
                  <form>
                    <TextField
                      label="Name"
                      variant="outlined"
                      fullWidth
                      value={newVendorData.vendor_name}
                      onChange={(e) =>
                        setNewVendorData({
                          ...newVendorData,
                          vendor_name: e.target.value,
                        })
                      }
                      error={!!formErrors.vendor_name}
                      helperText={formErrors.vendor_name}
                    />
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleAddVendorSubmit} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
              <TableHead>
                <TableRow>
                  {TABLE_HEAD.map((column) => (
                    <TableCell key={column.id}>{column.label}</TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((vendor) => (
                    <TableRow key={vendor.id}>
                      {TABLE_HEAD.map((column) => (
                        <TableCell key={column.id}>
                          {vendor[column.id]}
                        </TableCell>
                      ))}
                      <TableCell align="right" style={{ display: "flex" }}>
                        {canEditVendor && (
                          <MenuItem
                            variant="contained"
                            onClick={() => handleEdit(vendor.id)}
                          >
                            <Iconify icon={"eva:edit-fill"} />
                          </MenuItem>
                        )}
                        <Dialog open={openUpdateModel} onClose={handleClose}>
                          <DialogTitle>Edit Vendor</DialogTitle>
                          <DialogContent>
                            <form>
                              <TextField
                                label="Vendor Name"
                                variant="outlined"
                                fullWidth
                                value={newVendorData.vendor_name}
                                onChange={(e) =>
                                  setNewVendorData({
                                    ...newVendorData,
                                    vendor_name: e.target.value,
                                  })
                                }
                                error={!!formErrors.vendor_name}
                                helperText={formErrors.vendor_name}
                              />
                            </form>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button
                              onClick={handleUpdateVendorSubmit}
                              color="primary"
                            >
                              Update
                            </Button>
                          </DialogActions>
                        </Dialog>
                        {canDeleteVendor && (
                          <MenuItem
                            sx={{ color: "error.main" }}
                            onClick={() => handleDelete(vendor.id)}
                          >
                            <Iconify icon={"eva:trash-2-outline"} />
                          </MenuItem>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={4} />
                  </TableRow>
                )}
              </TableBody>
              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          Not found
                        </Typography>

                        <Typography variant="body2">
                          No results found for &nbsp;
                          <strong>&quot;{filterName}&quot;</strong>.
                          <br /> Try checking for typos or using complete words.
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Container>
      </div>
    </div>
  );
};

export default Vendor;
