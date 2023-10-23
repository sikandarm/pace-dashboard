import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { sentenceCase } from "change-case";
import Papa from "papaparse";
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

import { HomeRounded } from "@material-ui/icons";
// components
import Label from "../../components/label";
import Iconify from "../../components/iconify";
import Scrollbar from "../../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
// mock
import { useSelector } from "react-redux";
import { deleteJob, getJobs } from "../../feature/jobSlice";
import { fDate } from "../../utils/formatTime";
import ApiCall from "../../utils/apicall";
// import { readCSVFile } from '../../utils/readCSVFile';
// import { validateJobData } from '../../utils/validateJobData';
// import { jobCSVTamplate } from '../../utils/jobCSVTemplate';
import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "status", label: "status", alignRight: false },
  { id: "totalTasks", label: "Total Tasks", alignRight: false },
  { id: "completedTasks", label: "Completed Tasks", alignRight: false },
  { id: "startDate", label: "Start Date", alignRight: false },
  { id: "endDate", label: "End Date", alignRight: false },
  { id: "", label: "" },
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

export default function Jobs(props) {
  const dispatch = useDispatch();
  let open = false;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const { jobs, isJobLoading } = useSelector((state) => state.jobSlice);
  const [allJobs, setAllJobs] = useState([]);
  const { loginUser } = useSelector((state) => state.userSlice);
  const { permissions: userPermissions } = loginUser.decodedToken;
  const canAddJob = hasPermission(userPermissions, PERMISSIONS.ADD_JOB);
  const canEditJob = hasPermission(userPermissions, PERMISSIONS.EDIT_JOB);
  const canDeleteJob = hasPermission(userPermissions, PERMISSIONS.DELETE_JOB);
  const canExportJob = hasPermission(userPermissions, PERMISSIONS.EXPORT_JOB);
  const canViewJobList = hasPermission(userPermissions, PERMISSIONS.VIEW_JOB);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await ApiCall.get("/job/export");
      setAllJobs(response.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleExport = () => {
    const csvData = Papa.unparse(allJobs, { header: true });
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jobs.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  // const handleImport = async (event) => {
  //   const fileInput = document.createElement('input');
  //   fileInput.type = 'file';
  //   fileInput.accept = '.csv';
  //   fileInput.click();

  //   fileInput.addEventListener('change', async (e) => {
  //     const file = e.target.files[0];

  //     if (file) {
  //       try {
  //         const importedJobs = await readCSVFile(file);
  //         const totalJobs = importedJobs.length;
  //         const validJobs = validateJobData(importedJobs); // Perform the API call to save the data
  //         if (validJobs.length === 0) {
  //           toast.error('No valid data found 0 jobs added.');
  //           return;
  //         }

  //         await importJobsToDatabase(validJobs, totalJobs);
  //         console.log('Data imported successfully.');
  //         console.log(validJobs);
  //       } catch (error) {
  //         console.error('Error reading CSV file:', error);
  //       }
  //     }
  //   });
  // };

  // const importJobsToDatabase = async (jobsData, totalJobs) => {
  //   try {
  //     const addedJobs = jobsData.length;
  //     const res = await dispatch(importJob(jobsData));
  //     toast.success(`Import ${addedJobs} jobs successfully`);
  //     const notImportedJobs = totalJobs - addedJobs;
  //     if (notImportedJobs > 0) {
  //       toast.error(`${notImportedJobs} jobs not imported`);
  //     }
  //   } catch (error) {
  //     console.error('Error saving data to database:', error);
  //     throw error;
  //   }
  // };

  // const downloadCSVTemplate = () => {
  //   const csvContent = jobCSVTamplate();
  //   const blob = new Blob([csvContent], { type: 'text/csv' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'job_template.csv';
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = jobs.map((n) => n.name);
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
        jobs,
        (_inv) => _inv.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - jobs.length) : 0;

  const filteredUsers = applySortFilter(
    jobs,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;
  const handleDelete = (id) => {
    dispatch(deleteJob(id));
  };
  const handleOpenModel = () => {
    setOpenModel(!open);
  };

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);
  return (
    <>
      <Helmet>
        <title> Jobs | Pace Jobs </title>
      </Helmet>
      {openModel ? (
        <CModel
          isLoading={isJobLoading}
          open={openModel}
          setOpen={setOpenModel}
          filter={"add-job"}
        />
      ) : (
        ""
      )}
      {openUpdateModel ? (
        <CModel
          open={openUpdateModel}
          isLoading={isJobLoading}
          data={selectedRow}
          setOpen={setOpenUpdateModel}
          filter={"edit-job"}
        />
      ) : (
        ""
      )}
      {canViewJobList && (
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
                  / Jobs
                </Typography>
              </Stack>
            </Breadcrumbs>
            <div style={{ display: "flex", gap: "10px" }}>
              {canExportJob && (
                <Button
                  onClick={handleExport}
                  variant="outlined"
                  startIcon={<Iconify icon="ph:download-fill" />}
                >
                  Export Jobs
                </Button>
              )}
              {canAddJob && (
                <Button
                  onClick={handleOpenModel}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  New Job
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
                label={"Search Job.."}
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />

              <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                count={jobs.length}
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
                    rowCount={jobs.length}
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
                        const {
                          id,
                          name,
                          status,
                          totalTasks,
                          completedTasks,
                          startDate,
                          endDate,
                        } = row;
                        return (
                          <TableRow hover key={id} tabIndex={-1}>
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
                                color={
                                  status === "completed"
                                    ? "success"
                                    : status === "in_process"
                                    ? "secondary"
                                    : "error"
                                }
                              >
                                {sentenceCase(status)}
                              </Label>
                            </TableCell>
                            <TableCell align="left">
                              {totalTasks ? totalTasks : 0}
                            </TableCell>
                            <TableCell align="left">
                              {completedTasks ? completedTasks : 0}
                            </TableCell>
                            <TableCell align="left">
                              {startDate ? fDate(startDate) : "_"}
                            </TableCell>
                            <TableCell align="left">
                              {endDate ? fDate(endDate) : "_"}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ display: "flex" }}
                            >
                              {canEditJob && (
                                <MenuItem
                                  onClick={() => {
                                    setSelectedRow(row);
                                    setOpenUpdateModel(!openUpdateModel);
                                  }}
                                >
                                  <Iconify icon={"eva:edit-fill"} />
                                </MenuItem>
                              )}

                              {canDeleteJob && (
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
              count={jobs.length}
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
