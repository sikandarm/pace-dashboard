import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CModel from "../../components/CModel/CModel";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  // MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Breadcrumbs,
  DialogTitle,
  DialogActions,
  DialogContent,
  Dialog,
} from "@mui/material";
// components
import Iconify from "../../components/iconify";
import Scrollbar from "../../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
// mock
import { deleteBill } from "../../feature/shippinglistSlice";
import { useSelector } from "react-redux";
import { getbill } from "../../feature/shippinglistSlice";
import { HomeRounded } from "@material-ui/icons";
// import ApiCall from "../../utils/apicall";
// import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";
const TABLE_HEAD = [
  { id: "billTitle", label: "Bill Title", alignRight: false },
  { id: "address", label: "Address", alignRight: false },
  { id: "dilveryDate", label: "Delivery Date", alignRight: false },
  { id: "orderDate", label: "Order Date", alignRight: false },
  { id: "" },
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

export default function BillofLanding() {
  const dispatch = useDispatch();
  //   const open = false;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //   const [selectedRow, setSelectedRow] = useState("");
  const [openModel, setOpenModel] = useState(false);
  //   const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const { bill, isBillLoading } = useSelector((state) => state.billSlice);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);

  const navigate = useNavigate();
  //   const { loginUser } = useSelector((state) => state.userSlice);
  //   const { permissions: userPermissions } = loginUser.decodedToken;
  //   const canAddSequence = hasPermission(
  //     userPermissions,
  //     PERMISSIONS.ADD_SEQUENCE
  //   );
  //   const canEditSequence = hasPermission(
  //     userPermissions,
  //     PERMISSIONS.EDIT_SEQUENCE
  //   );
  //   const canDeleteSequence = hasPermission(
  //     userPermissions,
  //     PERMISSIONS.DELETE_SEQUENCE
  //   );

  //   const canViewSequenceList = hasPermission(
  //     userPermissions,
  //     PERMISSIONS.VIEW_SEQUENCE
  //   );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = bill.map((n) => n.billTitle);
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
        bill,
        (_inv) =>
          _inv.billTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bill.length) : 0;
  const filteredUsers = applySortFilter(
    bill,
    getComparator(order, orderBy),
    filterName
  );
  const isNotFound = !filteredUsers.length && !!filterName;

  const handleDelete = (billTitle) => {
    dispatch(deleteBill(billTitle));
    toast("Bill Deleted Successfully!");
  };
  // const handleDeleteDia = (billTitle) => {
  //   // console.log(billTitle, "IN HANDLEDELETEDIA");
  //   setSelectedContactId(billTitle);
  //   setOpenDeleteDialog(true);
  // };

  //   const handleOpenModel = () => {
  //     setOpenModel(!open);
  //   };

  const handleAddBill = () => {
    navigate("/Add-Bill");
  };

  useEffect(() => {
    // dispatch(getUsers());
    dispatch(getbill());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> ShippingList | Pace ShippingList </title>
      </Helmet>
      {openModel ? (
        <CModel
          isLoading={isBillLoading}
          open={openModel}
          setOpen={setOpenModel}
          filter={"add-bill"}
        />
      ) : (
        ""
      )}
      {/* {openUpdateModel
        ? ""
        : // <CModel
          //   open={openUpdateModel}
          //   isLoading={isBillLoading}
          //   data={selectedRow}
          //   setOpen={setOpenUpdateModel}
          //   filter={"update-bill"}
          // />
          ""} */}
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
                / Shipping List
              </Typography>
            </Stack>
          </Breadcrumbs>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              onClick={handleAddBill}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Bill
            </Button>
          </div>
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
            <UserListToolbar
              label={"Search Bill.."}
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
            <TablePagination
              rowsPerPageOptions={[10, 25]}
              component="div"
              count={bill.length}
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
                  // order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={bill.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.length === 0 && !isNotFound && (
                    <TableRow>
                      <TableCell
                        align="center"
                        colSpan={TABLE_HEAD.length}
                        sx={{ py: 3 }}
                      >
                        <Paper sx={{ textAlign: "center" }}>
                          <Typography variant="h6" paragraph>
                            No Record found
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, billTitle, address, dilveryDate, orderDate } =
                        row;

                      const formattedDate = new Date(
                        dilveryDate
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });
                      const formattedDate2 = new Date(
                        orderDate
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });
                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center">
                              <Typography
                                variant="subtitle2"
                                sx={{ padding: "0px 15px" }}
                                noWrap
                              >
                                {billTitle}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{address}</TableCell>
                          <TableCell align="left">{formattedDate}</TableCell>
                          <TableCell align="left">{formattedDate2}</TableCell>

                          <TableCell align="right" style={{ display: "flex" }}>
                            {/* <MenuItem
                              onClick={() => {
                                setSelectedRow(row);
                                setOpenUpdateModel(!openUpdateModel);
                              }}
                            >
                              <Iconify icon={"eva:edit-fill"} />
                            </MenuItem> */}

                            {/* <MenuItem
                              sx={{ color: "error.main" }}
                              onClick={() => handleDeleteDia(billTitle)}
                            >
                              <Iconify icon={"eva:trash-2-outline"} />
                            </MenuItem> */}
                          </TableCell>
                          <Dialog
                            open={openDeleteDialog}
                            onClose={() => setOpenDeleteDialog(false)}
                          >
                            <DialogTitle>Delete Bill</DialogTitle>
                            <DialogContent>
                              <Typography>
                                Are you sure you want to delete this Bill?
                              </Typography>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={() => setOpenDeleteDialog(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => {
                                  handleDelete(selectedContactId);
                                  setOpenDeleteDialog(false);
                                }}
                                color="primary"
                              >
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
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
            count={bill.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
