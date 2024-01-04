import React, { useState, useEffect } from "react";
import ApiCall from "../../utils/apicall";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Container,
  Stack,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Paper,
  Table,
  MenuItem,
  TablePagination,
  TextField,
  Button,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Breadcrumbs,
  TableContainer,
} from "@mui/material";
import { HomeRounded } from "@material-ui/icons";
import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";
import Iconify from "../../components/iconify";
import { validateCompanyForm } from "../../utils/companyValidations";
const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "address", label: "Address", alignRight: false },
  { id: "phone", label: "Phone", alignRight: false },
  { id: "fax", label: "Fax", alignRight: false },
];
const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [page, setPage] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [setLoading] = useState(true);
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { loginUser } = useSelector((state) => state.userSlice);
  const { permissions: userPermissions } = loginUser.decodedToken;
  const canAddCompnay = hasPermission(userPermissions, PERMISSIONS.ADD_Company);
  const canEditCompany = hasPermission(
    userPermissions,
    PERMISSIONS.Edit_Company
  );
  const canDeleteCompany = hasPermission(
    userPermissions,
    PERMISSIONS.Delete_Company
  );

  const [open, setOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    fax: "",
  });

  const handleEdit = async (company) => {
    const response = await ApiCall.get(`/company/${company}`);
    const companyData = response.data.data.company;
    setOpenUpdateModel(true);
    setEditFormData({
      id: companyData.id,
      name: companyData.name,
      email: companyData.email,
      address: companyData.address,
      phone: companyData.phone,
      fax: companyData.fax,
    });
  };

  const fetchCompanies = async () => {
    try {
      const response = await ApiCall.get("/company");
      setCompanies(response.data.data.companies);
      setSearchResults(response.data.data.companies);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    const fetchCompaniess = async () => {
      try {
        const response = await ApiCall.get("/company");
        setCompanies(response.data.data.companies);
        setSearchResults(response.data.data.companies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompaniess();
  }, [setLoading]);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await ApiCall.get("/company", {
          params: {
            page: page + 1,
          },
        });
        setCompanies(response.data.data.companies);
      } catch (error) {
        console.log("err", error);
      }
    };
    fetchPage();
  }, [page]);

  const handleEditCompanySubmit = async () => {
    // console.log("+++++", editFormData);
    const values = validateCompanyForm(editFormData);
    setFormErrors(values);
    if (Object.keys(values).length === 0) {
      try {
        const response = await ApiCall.put(
          `/company/${editFormData.id}`,
          editFormData
        );
        // console.log("resonse", response.data.data.company);

        if (response.status === 200) {
          fetchCompanies();
          toast("Company Updated Successfully!");
          // var updatedCompany = response.data.data.company;
          // var updatedCompanies = companies.map((company) =>
          //   company.id === updatedCompany.id ? updatedCompany : company
          // );
          //   setCompanies(updatedCompanies);
          // window.location.reload();
          //console.log(updatedCompanies, "11111");
          //console.log("Company edited successfully:", response.data);
          setEditFormData({
            name: "",
            email: "",
            address: "",
            phone: "",
            fax: "",
          });
          handleClose();
          setOpenUpdateModel(false);
        } else {
        }
      } catch (error) {
        console.error("Error editing company:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await ApiCall.delete(`/company/${id}`);
      if (response) {
        fetchCompanies();
        toast("Company Deleted Successfully!");
        setCompanies((company) => company.filter((order) => order.id !== id));
      } else {
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    fax: "",
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenModel = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFormErrors("");
    setFormData({
      name: "",
      email: "",
      address: "",
      phone: "",
      fax: "",
    });
    setOpenUpdateModel(false);
    setOpen(false);
  };

  const handleAddCompanySubmit = async () => {
    const values = validateCompanyForm(formData);
    setFormErrors(values);
    if (Object.keys(values).length === 0) {
      try {
        const response = await ApiCall.post("/company", formData);
        // console.log("Company added successfully:", response.data);
        if (response) {
          fetchCompanies();
          toast("Company Added Successfully!");
          setFormData({
            name: "",
            email: "",
            address: "",
            phone: "",
            fax: "",
          });
          setFormErrors("");
          handleClose();
        }
      } catch (error) {
        console.error("Error adding company:", error);
      }
    }
  };
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
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
      const response = await ApiCall.get("/company", {
        params: {
          name: filterName,
        },
      });
      setSearchResults(response.data.data.companies);
    } catch (error) {}
  };
  useEffect(() => {
    const handleSearchs = async () => {
      try {
        const response = await ApiCall.get("/company", {
          params: {
            name: filterName,
          },
        });
        setSearchResults(response.data.data.companies);
      } catch (error) {}
    };
    handleSearchs();
  }, [filterName]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - searchResults.length) : 0;
  const isNotFound = !searchResults.length && !!filterName;

  return (
    <div>
      <Helmet>
        <title>Companies | Pace Companies</title>
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
                  / Companies
                </Typography>
              </Stack>
            </Breadcrumbs>
            {canAddCompnay && (
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleOpenModel}
              >
                Add New Company
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
                label="Search Companies.."
                variant="outlined"
                margin="normal"
                value={filterName}
                onChange={handleFilterByName}
                onKeyDown={handleEnterKeyPress}
              />
              <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                count={companies.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
            <Table>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Company</DialogTitle>
                <DialogContent>
                  <form>
                    <TextField
                      label="Name"
                      variant="outlined"
                      fullWidth
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      error={formErrors.name !== undefined}
                      helperText={formErrors.name}
                      style={{ marginTop: "5px" }}
                    />
                    <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      error={formErrors.email !== undefined}
                      helperText={formErrors.email}
                      style={{ marginTop: "7px" }}
                    />
                    <TextField
                      label="Address"
                      variant="outlined"
                      fullWidth
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: e.target.value,
                        })
                      }
                      error={formErrors.address !== undefined}
                      helperText={formErrors.address}
                      style={{ marginTop: "7px" }}
                    />
                    <TextField
                      label="Phone"
                      variant="outlined"
                      fullWidth
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                      error={formErrors.phone !== undefined}
                      helperText={formErrors.phone}
                      style={{ marginTop: "7px" }}
                    />
                    <TextField
                      label="Fax"
                      variant="outlined"
                      fullWidth
                      value={formData.fax}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fax: e.target.value,
                        })
                      }
                      error={formErrors.fax !== undefined}
                      helperText={formErrors.fax}
                      style={{ marginTop: "7px" }}
                    />
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleAddCompanySubmit} color="primary">
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
                {Array.isArray(searchResults) &&
                  searchResults
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order) => (
                      <TableRow key={order.id}>
                        {TABLE_HEAD.map((column) => (
                          <TableCell key={column.id}>
                            {order[column.id]}
                          </TableCell>
                        ))}
                        <TableCell align="right" style={{ display: "flex" }}>
                          {canEditCompany && (
                            <MenuItem
                              variant="contained"
                              onClick={() => handleEdit(order.id)}
                            >
                              <Iconify icon={"eva:edit-fill"} />
                            </MenuItem>
                          )}
                          {openUpdateModel && (
                            <Dialog
                              open={openUpdateModel}
                              onClose={handleClose}
                            >
                              <DialogTitle>Edit Company</DialogTitle>
                              <DialogContent>
                                <form>
                                  <TextField
                                    label="name"
                                    variant="outlined"
                                    fullWidth
                                    value={editFormData.name}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        name: e.target.value,
                                      })
                                    }
                                    error={formErrors.name !== undefined}
                                    helperText={formErrors.name}
                                    style={{ marginTop: "7px" }}
                                  />

                                  <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    value={editFormData.email}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        email: e.target.value,
                                      })
                                    }
                                    error={formErrors.email !== undefined}
                                    helperText={formErrors.email}
                                    style={{ marginTop: "7px" }}
                                  />

                                  <TextField
                                    label="Phone"
                                    variant="outlined"
                                    fullWidth
                                    value={editFormData.phone}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        phone: e.target.value,
                                      })
                                    }
                                    error={formErrors.phone !== undefined}
                                    helperText={formErrors.phone}
                                    style={{ marginTop: "7px" }}
                                  />

                                  <TextField
                                    label="Address"
                                    variant="outlined"
                                    fullWidth
                                    value={editFormData.address}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        address: e.target.value,
                                      })
                                    }
                                    error={formErrors.address !== undefined}
                                    helperText={formErrors.address}
                                    style={{ marginTop: "7px" }}
                                  />

                                  <TextField
                                    label="fax"
                                    variant="outlined"
                                    fullWidth
                                    value={editFormData.fax}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        fax: e.target.value,
                                      })
                                    }
                                    error={formErrors.fax !== undefined}
                                    helperText={formErrors.fax}
                                    style={{ marginTop: "7px" }}
                                  />
                                </form>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button
                                  onClick={handleEditCompanySubmit}
                                  color="primary"
                                >
                                  Submit
                                </Button>
                              </DialogActions>
                            </Dialog>
                          )}
                          {canDeleteCompany && (
                            <MenuItem
                              sx={{ color: "error.main" }}
                              onClick={() => setSelectedItem(order)}
                            >
                              <Iconify icon={"eva:trash-2-outline"} />
                            </MenuItem>
                          )}
                        </TableCell>
                        <Dialog
                          open={selectedItem !== null}
                          onClose={() => setSelectedItem(null)}
                        >
                          <DialogTitle>Delete Company</DialogTitle>
                          <DialogContent>
                            <Typography>
                              Are you sure you want to delete company {""}
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

export default CompanyList;
