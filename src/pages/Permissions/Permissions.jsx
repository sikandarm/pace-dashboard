import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CModel from "../../components/CModel/CModel";
// @mui
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
import Label from "../../components/label";
import Iconify from "../../components/iconify";
import Scrollbar from "../../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
// mock
import { useSelector } from "react-redux";
import {
  deletePermission,
  getPermission,
} from "../../feature/permissionsSlice";
import { HomeRounded } from "@material-ui/icons";
import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
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

export default function NewPermissions(props) {
  const dispatch = useDispatch();
  const open = false;
  const [page, setPage] = useState(0);
  const order = "asc";
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const { permissions, isPermissionLoading } = useSelector(
    (state) => state.permissionSlice
  );
  const { loginUser } = useSelector((state) => state.userSlice);

  const { permissions: userPermissions } = loginUser.decodedToken;
  const canAddPermission = hasPermission(
    userPermissions,
    PERMISSIONS.ADD_PERMISSION
  );
  const canEditPermission = hasPermission(
    userPermissions,
    PERMISSIONS.EDIT_PERMISSION
  );
  const canDeletePermission = hasPermission(
    userPermissions,
    PERMISSIONS.DELETE_PERMISSION
  );
  const canViewPermissionList = hasPermission(
    userPermissions,
    PERMISSIONS.VIEW_PERMISSION
  );

  const handleRequestSort = (event, property) => {
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = permissions.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      return a[1] - b[1];
    });
    if (query) {
      return filter(
        permissions,
        (_perm) => _perm.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - permissions.length) : 0;
  const filteredUsers = applySortFilter(
    permissions,
    getComparator(order, orderBy),
    filterName
  );
  const isNotFound = !filteredUsers.length && !!filterName;

  const handleDelete = (id) => {
    dispatch(deletePermission(id));
  };
  const handleOpenModel = () => {
    setOpenModel(!open);
  };
  useEffect(() => {
    dispatch(getPermission());
  }, [dispatch]);
  return (
    <>
      <Helmet>
        <title> Permissions | Pace Permissions </title>
      </Helmet>
      {openModel ? (
        <CModel
          isLoading={isPermissionLoading}
          open={openModel}
          setOpen={setOpenModel}
          filter={"add-permission"}
        />
      ) : (
        ""
      )}
      {openUpdateModel ? (
        <CModel
          open={openUpdateModel}
          isLoading={isPermissionLoading}
          data={selectedRow}
          setOpen={setOpenUpdateModel}
          filter={"edit-permission"}
        />
      ) : (
        ""
      )}
      {canViewPermissionList && (
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
                  / Permissions
                </Typography>
              </Stack>
            </Breadcrumbs>
            {canAddPermission && (
              <Button
                onClick={handleOpenModel}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Permission
              </Button>
            )}
          </Stack>

          <Card>
            <UserListToolbar
              label={"Search Permission.."}
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />

            <Scrollbar>
              <TableContainer>
                <Table>
                  <UserListHead
                    disableCheckbox={true}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={permissions.length}
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
                      .map((row) => {
                        const { id, name, isActive } = row;
                        return (
                          <TableRow key={id}>
                            <TableCell
                              component="th"
                              scope="row"
                              padding="none"
                            >
                              <Stack direction="row" alignItems="center">
                                <Typography
                                  sx={{ padding: "0px 15px" }}
                                  variant="subtitle2"
                                  noWrap
                                >
                                  {name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left">
                              <Label
                                color={isActive === true ? "success" : "error"}
                              >
                                {sentenceCase(
                                  isActive ? "active" : "In Active"
                                )}
                              </Label>
                            </TableCell>

                            <TableCell
                              align="right"
                              style={{ display: "flex" }}
                            >
                              {canEditPermission && (
                                <MenuItem
                                  onClick={() => {
                                    setSelectedRow(row);
                                    setOpenUpdateModel(!openUpdateModel);
                                  }}
                                >
                                  <Iconify icon={"eva:edit-fill"} />
                                </MenuItem>
                              )}

                              {canDeletePermission && (
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
              count={permissions.length}
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
