import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CModel from "../../components/CModel/CModel";
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Breadcrumbs,
} from "@mui/material";
// components
import Iconify from "../../components/iconify";
import Scrollbar from "../../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
// mock
import { deletesequence } from "../../feature/sequenceSlice";
import { useSelector } from "react-redux";
import { getSequence } from "../../feature/sequenceSlice";
import { HomeRounded } from "@material-ui/icons";
// import ApiCall from "../../utils/apicall";
import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";
import { useNavigate } from "react-router-dom";
const TABLE_HEAD = [
  {
    id: "sequence_name",
    label: "Sequence Name",
    alignRight: false,
  },
  { id: "Job", label: "Job Name", alignRight: false },
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

export default function Sequence() {
  const dispatch = useDispatch();
  const open = false;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const navigation = useNavigate();
  const { sequence, isSequenceLoading } = useSelector(
    (state) => state.sequenceSlice
  );
  const { loginUser } = useSelector((state) => state.userSlice);
  const { permissions: userPermissions } = loginUser.decodedToken;
  const canAddSequence = hasPermission(
    userPermissions,
    PERMISSIONS.ADD_SEQUENCE
  );
  const canEditSequence = hasPermission(
    userPermissions,
    PERMISSIONS.EDIT_SEQUENCE
  );
  const canDeleteSequence = hasPermission(
    userPermissions,
    PERMISSIONS.DELETE_SEQUENCE
  );

  const canViewSequenceList = hasPermission(
    userPermissions,
    PERMISSIONS.VIEW_SEQUENCE
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = sequence.map((n) => n.sequence_name);
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
        sequence,
        (_inv) =>
          _inv.sequence_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sequence.length) : 0;
  const filteredUsers = applySortFilter(
    sequence,
    getComparator(order, orderBy),
    filterName
  );
  const isNotFound = !filteredUsers.length && !!filterName;

  const handleDelete = (id) => {
    dispatch(deletesequence(id));
  };
  const handleOpenModel = () => {
    setOpenModel(!open);
  };

  useEffect(() => {
    // dispatch(getUsers());
    dispatch(getSequence());
  }, [dispatch]);

  const handleOpenDetail = (id) => {
    navigation(`/sequence-detail/${id}`);
  };

  return (
    <>
      <Helmet>
        <title> Sequence | Pace Sequence </title>
      </Helmet>
      {openModel ? (
        <CModel
          isLoading={isSequenceLoading}
          open={openModel}
          setOpen={setOpenModel}
          filter={"add-sequence"}
        />
      ) : (
        ""
      )}
      {openUpdateModel ? (
        <CModel
          open={openUpdateModel}
          isLoading={isSequenceLoading}
          data={selectedRow}
          setOpen={setOpenUpdateModel}
          filter={"update-sequence"}
        />
      ) : (
        ""
      )}
      {canViewSequenceList && (
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
                  / Sequence
                </Typography>
              </Stack>
            </Breadcrumbs>
            <div style={{ display: "flex", gap: "10px" }}>
              {canAddSequence && (
                <Button
                  onClick={handleOpenModel}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  New Sequence
                </Button>
              )}
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
                label={"Search sequence.."}
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />
              <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                count={sequence.length}
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
                    rowCount={sequence.length}
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
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        const { id, sequence_name, Job } = row;
                        return (
                          <TableRow hover key={id} tabIndex={-1}>
                            <TableCell
                              component="th"
                              scope="row"
                              padding="none"
                            >
                              <Stack direction="row" alignItems="center">
                                <Typography
                                  variant="subtitle2"
                                  sx={{ padding: "0px 15px" }}
                                  noWrap
                                >
                                  {sequence_name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left">{Job}</TableCell>

                            <TableCell
                              align="right"
                              style={{ display: "flex" }}
                            >
                              {canEditSequence && (
                                <MenuItem
                                  onClick={() => {
                                    setSelectedRow(row);
                                    setOpenUpdateModel(!openUpdateModel);
                                  }}
                                >
                                  <Iconify icon={"eva:edit-fill"} />
                                </MenuItem>
                              )}

                              {canDeleteSequence && (
                                <MenuItem
                                  sx={{ color: "error.main" }}
                                  onClick={() => handleDelete(id)}
                                >
                                  <Iconify icon={"eva:trash-2-outline"} />
                                </MenuItem>
                              )}
                              {canEditSequence && (
                                <MenuItem onClick={() => handleOpenDetail(id)}>
                                  <Iconify icon={"eva:info-outline"} />
                                </MenuItem>
                              )}
                            </TableCell>
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
              count={sequence.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      )}
    </>
  );
}
