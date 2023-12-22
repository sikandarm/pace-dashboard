import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CModel from "../../components/CModel/CModel";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  // Button,
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
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
import { useSelector } from "react-redux";
import {
  clearErrorMessage,
  deleteRole,
  getRoles,
} from "../../feature/roleSlice";
import { getPermission } from "../../feature/permissionsSlice";
import { HomeRounded } from "@material-ui/icons";
import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "permission", label: "Permission   ", alignRight: false },
  { id: "" },
];

export default function Roles(props) {
  const dispatch = useDispatch();
  //const open = false;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errorMesage, setErrorMessage] = useState("");
  const [selectedRow, setSelectedRow] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const { roles, message } = useSelector((state) => state.roleSlice);
  const { permissions } = useSelector((state) => state.permissionSlice);
  const { loginUser } = useSelector((state) => state.userSlice);

  const { permissions: userPermissions } = loginUser.decodedToken;
  const canAddRole = hasPermission(userPermissions, PERMISSIONS.ADD_ROLE);
  const canEditRole = hasPermission(userPermissions, PERMISSIONS.EDIT_ROLE);
  const canDeleteRole = hasPermission(userPermissions, PERMISSIONS.DELETE_ROLE);
  const canViewRoleList = hasPermission(userPermissions, PERMISSIONS.VIEW_ROLE);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = roles.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  function applySortFilter(array, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);

    if (query) {
      return filter(
        roles,
        (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roles.length) : 0;
  const filteredUsers = applySortFilter(roles, filterName);
  const isNotFound = !filteredUsers.length && !!filterName;

  const handleDelete = (id) => {
    dispatch(deleteRole(id));
  };
  // const handleOpenModel = () => {
  //   setOpenModel(!open);
  // };
  useEffect(() => {
    if (message) {
      setErrorMessage(message);
    }
    dispatch(clearErrorMessage());
    return;
  }, [dispatch, message]);
  useEffect(() => {
    dispatch(getRoles());
    dispatch(getPermission());
  }, [dispatch, openModel, openUpdateModel]);
  return (
    <>
      {errorMesage ? errorMesage : ""}
      <Helmet>
        <title> Role | Pace Role </title>
      </Helmet>
      {openModel ? (
        <CModel open={openModel} setOpen={setOpenModel} filter={"add-role"} />
      ) : (
        ""
      )}
      {openUpdateModel ? (
        <CModel
          open={openUpdateModel}
          data={selectedRow}
          permissions={permissions}
          setOpen={setOpenUpdateModel}
          filter={"update-role"}
        />
      ) : (
        ""
      )}
      {canViewRoleList && (
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
                  / Roles
                </Typography>
              </Stack>
            </Breadcrumbs>
            {canAddRole &&
              // <Button onClick={handleOpenModel} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              //   New Role
              // </Button>
              ""}
          </Stack>

          <Card>
            <UserListToolbar
              label={"Search role.."}
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />

            <Scrollbar>
              <TableContainer>
                <Table>
                  <UserListHead
                    // order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={roles.length}
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
                        const { id, name, permissions } = row;
                        const selectedUser = selected.indexOf(name) !== -1;
                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={selectedUser}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              padding="none"
                            >
                              <Stack direction="row" alignItems="center">
                                {/* <Avatar alt={name} src={'R'} /> */}
                                <Typography
                                  variant="subtitle2"
                                  sx={{ padding: "0px 15px" }}
                                  noWrap
                                >
                                  {name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left">
                              {permissions ? permissions.length : 0}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ display: "flex" }}
                            >
                              {canEditRole && (
                                <MenuItem
                                  onClick={() => {
                                    setSelectedRow(row);
                                    setOpenUpdateModel(!openUpdateModel);
                                  }}
                                >
                                  <Iconify icon={"eva:edit-fill"} />
                                </MenuItem>
                              )}

                              {canDeleteRole && (
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
              count={roles.length}
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
