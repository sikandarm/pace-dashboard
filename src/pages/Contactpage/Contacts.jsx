import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Dialog,
  TableRow,
  MenuItem,
  TableBody,
  TextField,
  Container,
  TableCell,
  Typography,
  Breadcrumbs,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  TablePagination,
} from "@mui/material";
import { HomeRounded } from "@material-ui/icons";
import Iconify from "../../components/iconify";
import ApiCall from "../../utils/apicall";
import Scrollbar from "../../components/scrollbar";
import { UserListHead } from "../../sections/@dashboard/user";
import { deleteContact, getContacts } from "../../feature/ContactSlice";
import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";
import { validateContactForm } from "../../utils/ContactFormValidation";

const TABLE_HEAD = [
  { id: "firstName", label: "First Name", alignRight: false },
  { id: "lastName", label: "Last Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "phoneNumber", label: "Phone Number", alignRight: false },
  { id: "Actions", label: "", alignRight: false },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function Contacts() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [selectedRow, setSelectedRow] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const { loginUser } = useSelector((state) => state.userSlice);
  const { permissions: userPermissions } = loginUser.decodedToken;
  const canAddContact = hasPermission(userPermissions, PERMISSIONS.ADD_CONTACT);
  const canEditContact = hasPermission(
    userPermissions,
    PERMISSIONS.EDIT_CONTACT
  );
  const canDeleteContact = hasPermission(
    userPermissions,
    PERMISSIONS.DELETE_CONTACT
  );

  const contacts = useSelector((state) => state.ContactSlice.contacts);
    console.log("length",contacts.length);
  const fetchContacts = async () => {
    try {
      const response = await ApiCall.get("/contact");
      dispatch(getContacts(response.data.data));
    } catch (error) {}
  };
  useEffect(() => {
    fetchContacts();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = contacts.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(
        contacts,
        (_inv) =>
          _inv.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contacts.length) : 0;

  const filteredUsers = applySortFilter(
    contacts,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;
  const handleDelete = (id) => {
    dispatch(deleteContact(id));
  };

  const [open, setOpen] = useState(false);

  const initialNewContact = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  };
  const [newContact, setNewContact] = useState({ ...initialNewContact });

  const handleCreateContact = async (e) => {
    const values = validateContactForm(newContact);

    setFormErrors(values);
    if (Object.keys(values).length === 0) {
      try {
        const newContactData = {
          firstName: newContact.firstName,
          lastName: newContact.lastName,
          email: newContact.email,
          phoneNumber: newContact.phoneNumber,
        };

        const response = await ApiCall.post("/contact", newContactData);

        if (response.status === 201) {
          const newContact = response.data;
          handleClose();
          dispatch(getContacts([...contacts, newContact]));
          setNewContact({ ...initialNewContact });
        } else {
        }
      } catch (error) {}
    }
  };

  const handleUpdateContact = async () => {
    try {
      const response = await ApiCall.put(
        `contact/${selectedRow.id}`,
        selectedRow
      );

      if (response.status === 200) {
        const updatedContact = response.data;
        const updatedContacts = contacts.map((contact) =>
          contact.id === updatedContact.id ? updatedContact : contact
        );
        handleClose();
        dispatch(getContacts(updatedContacts));
        setOpenUpdateModel(false);
      } else {
      }
    } catch (error) {}
  };

  const handleOpenModel = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpenUpdateModel(false);
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

  const handleSearch = async () => {
    try {
      const response = await ApiCall.get("/contact", {
        params: {
          firstName: filterName,
        },
      });
      contacts(response.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <>
      <Helmet>
        <title>Contacts | Pace Contact</title>
      </Helmet>
      <div className="container">
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
                  / Contacts
                </Typography>
              </Stack>
            </Breadcrumbs>

            {canAddContact && (
              <Button
                onClick={handleOpenModel}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Contact
              </Button>
            )}
            {openUpdateModel && (
              <Dialog open={openUpdateModel} onClose={handleClose}>
                <DialogTitle style={{ background: "#2196F3", color: "#fff" }}>
                  Edit Contact
                </DialogTitle>
                <DialogContent>
                  <TextField
                    label="First Name"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    value={selectedRow.firstName}
                    onChange={(e) =>
                      setSelectedRow({
                        ...selectedRow,
                        firstName: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="Last Name"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    value={selectedRow.lastName}
                    onChange={(e) =>
                      setSelectedRow({
                        ...selectedRow,
                        lastName: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    value={selectedRow.email}
                    onChange={(e) =>
                      setSelectedRow({ ...selectedRow, email: e.target.value })
                    }
                  />
                  <TextField
                    label="Phone Number"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    value={selectedRow.phoneNumber}
                    onChange={(e) =>
                      setSelectedRow({
                        ...selectedRow,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateContact} color="primary">
                    Update
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            <Dialog open={open} onClose={handleClose}>
              <DialogTitle style={{ background: "#2196F3", color: "#fff" }}>
                Add New Contact
              </DialogTitle>
              <DialogContent>
                <form>
                  <TextField
                    label="First Name"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={newContact.firstName}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        firstName: e.target.value,
                      })
                    }
                    error={formErrors.firstName !== undefined}
                    helperText={formErrors.firstName}
                  />
                  <TextField
                    label="Last Name"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={newContact.lastName}
                    onChange={(e) =>
                      setNewContact({ ...newContact, lastName: e.target.value })
                    }
                    error={formErrors.lastName !== undefined}
                    helperText={formErrors.lastName}
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                    error={formErrors.email !== undefined}
                    helperText={formErrors.email}
                  />
                  <TextField
                    label="Phone Number"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={newContact.phoneNumber}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        phoneNumber: e.target.value,
                      })
                    }
                    error={formErrors.phoneNumber !== undefined}
                    helperText={formErrors.phoneNumber}
                  />
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleCreateContact} color="primary">
                  Create
                </Button>
              </DialogActions>
            </Dialog>
          </Stack>

          <Card>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                label="Search Contact.."
                variant="outlined"
                margin="normal"
                value={filterName}
                onChange={handleFilterByName}
                onKeyDown={handleEnterKeyPress}
              />

              <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                count={contacts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={contacts.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((contact) => {
                        const { id, firstName, lastName, email, phoneNumber } =
                          contact;
                        return (
                          <TableRow hover key={id} tabIndex={-1}>
                            <TableCell component="th" scope="row">
                              {firstName}
                            </TableCell>
                            <TableCell align="left">{lastName}</TableCell>
                            <TableCell align="left">{email}</TableCell>
                            <TableCell align="left">{phoneNumber}</TableCell>
                            <TableCell
                              align="right"
                              style={{ display: "flex" }}
                            >
                              {canEditContact && (
                                <MenuItem
                                  onClick={() => {
                                    setSelectedRow(contact);
                                    setOpenUpdateModel(!openUpdateModel);
                                  }}
                                >
                                  <Iconify icon={"eva:edit-fill"} />
                                </MenuItem>
                              )}
                              {canDeleteContact && (
                                <MenuItem
                                  sx={{ color: "error.main" }}
                                  onClick={() => handleDelete(id)}
                                >
                                  <Iconify icon={"eva:trash-2-outline"} />
                                </MenuItem>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
                              <br /> Try checking for typos or using complete
                              words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[10, 25]}
              component="div"
              count={contacts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      </div>
    </>
  );
}
