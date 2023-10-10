import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CModel from '../../components/CModel/CModel';
import Papa from 'papaparse';
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
} from '@mui/material';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import { getUsers } from '../../feature/userSlice';
import { useSelector } from 'react-redux';
import { deleteInventory, getInventory } from '../../feature/inventorySlice';
import { HomeRounded } from '@material-ui/icons';
import ApiCall from '../../utils/apicall';
import { hasPermission, PERMISSIONS } from '../../utils/hasPermission';

const TABLE_HEAD = [
  { id: 'ediStdNomenclature', label: 'Edi Std Nomen Clature', alignRight: false },
  { id: 'itemType', label: 'Item Type', alignRight: false },
  { id: 'shape', label: 'Shape', alignRight: false },
  { id: 'weight', label: 'Weight', alignRight: false },
  { id: 'depth', label: 'Depth', alignRight: false },
  { id: 'orderArrivedInFull', label: 'Order Arrived In Full', alignRight: false },
  { id: 'orderArrivedCMTR', label: 'Order Arrived In CMTR', alignRight: false },
  { id: 'quantity', label: 'Quantity', alignRight: false },
  { id: '' },
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
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function Users(props) {
  const dispatch = useDispatch();
  const open = false;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState('');
  const [openModel, setOpenModel] = useState(false);
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const { inventory, isInventoryLoading } = useSelector((state) => state.inventorySlice);
  const [inventories, setIntventories] = useState([]);
  const { loginUser } = useSelector((state) => state.userSlice);

  const { permissions: userPermissions } = loginUser.decodedToken;
  const canAddInventory = hasPermission(userPermissions, PERMISSIONS.ADD_INVENTORY);
  const canEditInventory = hasPermission(userPermissions, PERMISSIONS.EDIT_INVENTORY);
  const canDeleteInventory = hasPermission(userPermissions, PERMISSIONS.DELETE_INVENTORY);
  const canExportInventory = hasPermission(userPermissions, PERMISSIONS.EXPORT_INVENTORY);
  const canViewInventoryList = hasPermission(userPermissions, PERMISSIONS.VIEW_INVENTORY);

  useEffect(() => {
    fetchInventories();
  }, []);

  const fetchInventories = async () => {
    try {
      const response = await ApiCall.get('/inventory/export');
      setIntventories(response.data.data); // Assuming the response is an array of tasks
    } catch (error) {
      console.error('Error fetching inventories:', error);
    }
  };

  const handleExport = () => {
    const customCsvData = inventories.map((inventory) => ({
      ediStdNomenclature: inventory.ediStdNomenclature,
      aiscManualLabel: inventory.aiscManualLabel,
      shape: inventory.shape,
      weight: inventory.weight,
      depth: inventory.depth,
      grade: inventory.grade,
      poNumber: inventory.poNumber,
      heatNumber: inventory.heatNumber,
      orderArrivedInFull: inventory.orderArrivedInFull,
      orderArrivedCMTR: inventory.orderArrivedCMTR,
      itemType: inventory.itemType,
      lengthReceivedFoot: inventory.lengthReceivedFoot,
      lengthReceivedInch: inventory.lengthReceivedInch,
      quantity: inventory.quantity,
      poPulledFromNumber: inventory.poPulledFromNumber,
      lengthUsedFoot: inventory.lengthUsedFoot,
      lengthUsedInch: inventory.lengthUsedInch,
      lengthRemainingFoot: inventory.lengthRemainingFoot,
      lengthRemainingInch: inventory.lengthRemainingInch,
    }));
    const csvData = Papa.unparse(customCsvData, { header: true });
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventories.csv';
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = inventory.map((n) => n.ediStdNomenclature);
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
      return filter(inventory, (_inv) => _inv.ediStdNomenclature.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - inventory.length) : 0;
  const filteredUsers = applySortFilter(inventory, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;

  const handleDelete = (id) => {
    dispatch(deleteInventory(id));
  };
  const handleOpenModel = () => {
    setOpenModel(!open);
  };

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getInventory());
  }, [dispatch]);
  return (
    <>
      <Helmet>
        <title> Inventory | Pace Inventory </title>
      </Helmet>
      {openModel ? (
        <CModel isLoading={isInventoryLoading} open={openModel} setOpen={setOpenModel} filter={'add-inventory'} />
      ) : (
        ''
      )}
      {openUpdateModel ? (
        <CModel
          open={openUpdateModel}
          isLoading={isInventoryLoading}
          data={selectedRow}
          setOpen={setOpenUpdateModel}
          filter={'update-inventory'}
        />
      ) : (
        ''
      )}
      {canViewInventoryList && (
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Breadcrumbs aria-label="breadcrumb">
              <Stack direction="row" alignItems="center" spacing={1}>
                <HomeRounded color="inherit" />
                <Typography variant="body1" color="textPrimary">
                  / Inventory
                </Typography>
              </Stack>
            </Breadcrumbs>
            <div style={{ display: 'flex', gap: '10px' }}>
              {canExportInventory && (
                <Button onClick={handleExport} variant="outlined" startIcon={<Iconify icon="ph:download-fill" />}>
                  Export Inventory
                </Button>
              )}
              {canAddInventory && (
                <Button onClick={handleOpenModel} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                  New Inventory
                </Button>
              )}
            </div>
          </Stack>

          <Card>
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <UserListToolbar
                label={'Search inventory..'}
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />
              <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                count={inventory.length}
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
                    rowCount={inventory.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers.length === 0 && !isNotFound && (
                      <TableRow>
                        <TableCell align="center" colSpan={TABLE_HEAD.length} sx={{ py: 3 }}>
                          <Paper sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" paragraph>
                              No Record found
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const {
                        id,
                        ediStdNomenclature,
                        shape,
                        weight,
                        depth,
                        orderArrivedInFull,
                        orderArrivedCMTR,
                        itemType,
                        quantity,
                      } = row;

                      // const selectedUser = selected.indexOf(ediStdNomenclature) !== -1;
                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center">
                              <Typography variant="subtitle2" sx={{ padding: '0px 15px' }} noWrap>
                                {ediStdNomenclature}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{itemType}</TableCell>
                          <TableCell align="left">{shape}</TableCell>
                          <TableCell align="left">{weight}</TableCell>
                          <TableCell align="left">{depth}</TableCell>
                          <TableCell align="left">
                            <Label color={orderArrivedInFull === true ? 'success' : 'error'}>
                              {sentenceCase(orderArrivedInFull ? 'Yes' : 'No')}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label color={orderArrivedCMTR === true ? 'success' : 'error'}>
                              {sentenceCase(orderArrivedInFull ? 'Yes' : 'No')}
                            </Label>
                          </TableCell>
                          <TableCell align="left">{quantity}</TableCell>
                          <TableCell align="right" style={{ display: 'flex' }}>
                            {canEditInventory && (
                              <MenuItem
                                onClick={() => {
                                  setSelectedRow(row);
                                  setOpenUpdateModel(!openUpdateModel);
                                }}
                              >
                                <Iconify icon={'eva:edit-fill'} />
                              </MenuItem>
                            )}

                            {canDeleteInventory && (
                              <MenuItem sx={{ color: 'error.main' }} onClick={() => handleDelete(id)}>
                                <Iconify icon={'eva:trash-2-outline'} />
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
                              textAlign: 'center',
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
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[10, 25]}
              component="div"
              count={inventory.length}
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
