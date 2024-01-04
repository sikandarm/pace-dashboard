import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";

// @mui
import {
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  Breadcrumbs,
  TableHead,
  Container,
  Card,
} from "@mui/material";
// components
import Label from "../../components/label";
import Iconify from "../../components/iconify";
import { deleteUser, getUsers } from "../../feature/userSlice";
import { useSelector } from "react-redux";
import { getRoles } from "../../feature/roleSlice";
import { HomeRounded } from "@material-ui/icons";
import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";
import UserModal from "../../components/Modals/UserModal";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";
import { showSuccessToast } from "../../utils/Toast";
import SkeletonTable from "../../components/SkeletonTable";
import SearchInput from "../../components/Search";

const Users = () => {
  const dispatch = useDispatch();
  const { loginUser } = useSelector((state) => state.userSlice);
  const { usersList, isLoading } = useSelector((state) => state.userSlice);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { permissions: userPermissions } = loginUser.decodedToken;
  const canAddUSer = hasPermission(userPermissions, PERMISSIONS.ADD_USER);
  const canEditUSer = hasPermission(userPermissions, PERMISSIONS.EDIT_USER);
  const canDeleteUSer = hasPermission(userPermissions, PERMISSIONS.DELETE_USER);
  const canViewUserList = hasPermission(userPermissions, PERMISSIONS.VIEW_USER);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openUserModal = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
    closeDeleteModal();
    showSuccessToast("User deleted succesfully");
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getRoles());
  }, [dispatch]);

  const filteredUsers = usersList.filter((user) =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userRows = filteredUsers
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.firstName}</TableCell>
        <TableCell>
          <Label color={user.isActive === true ? "success" : "error"}>
            {user.isActive ? "Active" : "Suspended"}
          </Label>
        </TableCell>
        <TableCell>{user.phone}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.ratePerHour}</TableCell>
        <TableCell
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {canEditUSer && (
            <MenuItem onClick={() => openUserModal(user)}>
              <Iconify icon={"eva:edit-fill"} />
            </MenuItem>
          )}
          {canDeleteUSer && (
            <MenuItem
              sx={{ color: "error.main" }}
              onClick={() => openDeleteModal(user)}
            >
              <Iconify icon={"eva:trash-2-outline"} />
            </MenuItem>
          )}
        </TableCell>
      </TableRow>
    ));

  return (
    <>
      <Helmet>
        <title> Users | Pace Users </title>
      </Helmet>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDeleteUser(selectedUser.id)}
      />
      {isUserModalOpen && (
        <UserModal
          user={selectedUser ? selectedUser : null}
          isOpen={isUserModalOpen}
          onClose={closeUserModal}
        />
      )}
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
                / Users
              </Typography>
            </Stack>
          </Breadcrumbs>
          {canAddUSer && (
            <Button
              onClick={() => openUserModal()}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New User
            </Button>
          )}
        </Stack>
        {canViewUserList && (
          <Card>
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search user..."
            />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow hover>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>RatePerHour</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: rowsPerPage }, (_, index) => (
                      <SkeletonTable key={index} numColumns={5} />
                    ))
                  ) : userRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No Records Found
                      </TableCell>
                    </TableRow>
                  ) : (
                    userRows
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        )}
      </Container>
    </>
  );
};

export default Users;
