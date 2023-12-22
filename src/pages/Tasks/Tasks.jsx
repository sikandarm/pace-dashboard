import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import Papa from "papaparse";
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
  Modal,
  IconButton,
} from "@mui/material";

// components
import Label from "../../components/label";
import Iconify from "../../components/iconify";
import Scrollbar from "../../components/scrollbar";
// sections
import { UserListHead, UserListToolbar } from "../../sections/@dashboard/user";
// mock
import { getUsers } from "../../feature/userSlice";
import { useSelector } from "react-redux";
// import { deleteInventory, getInventory } from '../../feature/inventorySlice';
import {
  deleteTasks,
  getRejectionReasons,
  getSingleTasks,
  getTasks,
} from "../../feature/tasksSlice";
import { getJobs } from "../../feature/jobSlice";
import ApiCall from "../../utils/apicall";
import { HomeRounded } from "@material-ui/icons";
import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";
// import ConformationModel from '../../components/CModel/ConformationModel';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: "image", label: "Image", alignRight: false },
  { id: "pmkNumber", label: "PMK Number", alignRight: false },
  { id: "heatNo", label: "Heat Number", alignRight: false },
  { id: "description", label: "Description", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  // { id: 'comments', label: 'Comments', alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

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

export default function Tasks(props) {
  const dispatch = useDispatch();
  const open = null;
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [conformation, setConformation] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [openCallModel, setOpenCallModel] = useState(false);
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const { tasks, isTaskLoading, rejectionReasons } = useSelector(
    (state) => state.tasksSlice
  );
  const { jobs } = useSelector((state) => state.jobSlice);
  const { usersList, loginUser } = useSelector((state) => state.userSlice);
  const [allTasks, setAllTasks] = useState([]);
  const { permissions: userPermissions } = loginUser.decodedToken;
  const canAddTask = hasPermission(userPermissions, PERMISSIONS.ADD_TASK);
  const canEditTask = hasPermission(userPermissions, PERMISSIONS.EDIT_TASK);
  const canDeleteTask = hasPermission(userPermissions, PERMISSIONS.DELETE_TASK);
  const canExportTask = hasPermission(userPermissions, PERMISSIONS.EXPORT_TASK);
  const canViewTaskList = hasPermission(userPermissions, PERMISSIONS.VIEW_TASK);
  const canViewWhiteboard = hasPermission(
    userPermissions,
    PERMISSIONS.COLLABORATE_ON_MICROSOFT_WHITEBOARD
  );
  const canDownloadDiagram = hasPermission(
    userPermissions,
    PERMISSIONS.Download_Diagram
  );
  const canMakeCall = hasPermission(userPermissions, PERMISSIONS.Make_Call);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const openFullscreen = (image) => {
    setFullscreenImage(image);
    setIsFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    setIsFullscreenOpen(false);
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await ApiCall.get("/task/export");
      setAllTasks(response.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleExport = () => {
    const customCsvData = allTasks.map((task) => ({
      pmkNumber: task.pmkNumber,
      heatNo: task.heatNo,
      userName: task.userName,
      JobName: task.JobName,
      estimatedHour: task.estimatedHour,
      description: task.description,
      status: task.status,
      comments: task.comments,
      projectManager: task.projectManager,
      QCI: task.QCI,
      fitter: task.fitter,
      welder: task.welder,
      painter: task.painter,
      foreman: task.foreman,
      startedAt: task.startedAt,
      completedAt: task.completedAt,
    }));

    const csvData = Papa.unparse(customCsvData, { header: true });
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tasks.map((n) => n.pmkNumber);
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
        tasks,
        (_inv) =>
          _inv.pmkNumber.toLowerCase().indexOf(query.toLowerCase()) !== -1
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tasks.length) : 0;

  const filteredUsers = applySortFilter(
    tasks,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  const handleDelete = (id) => {
    dispatch(deleteTasks(deleteId)).then((res) => {
      if (res.type === "deleteTasks/tasks/fulfilled") {
        setConformation(false);
      }
    });
  };

  const handleOpenModel = () => {
    setOpenModel(!open);
  };

  useEffect(() => {
    dispatch(getTasks());
    dispatch(getJobs());
    dispatch(getUsers());
    dispatch(getRejectionReasons());
  }, [dispatch]);

  const handleDownload = async (image) => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "image.jpeg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };
  const handleCollaborate = () => {
    const whiteboardUrl =
      "https://apps.apple.com/us/app/microsoft-whiteboard/id1352499399";
    window.open(whiteboardUrl, "_blank");
  };

  const handleOpenCallModel = () => {
    setOpenCallModel(!open);
  };
  return (
    <>
      <Helmet>
        <title> Tasks | Pace Tasks </title>
      </Helmet>
      {openModel ? (
        <CModel
          users={usersList}
          isLoading={isTaskLoading}
          open={openModel}
          setOpen={setOpenModel}
          jobs={jobs}
          filter={"add-task"}
        />
      ) : (
        ""
      )}
      {openUpdateModel ? (
        <CModel
          open={openUpdateModel}
          isLoading={isTaskLoading}
          data={selectedRow}
          setOpen={setOpenUpdateModel}
          filter={"edit-task"}
          jobs={jobs}
          users={usersList}
          reasons={rejectionReasons}
        />
      ) : (
        ""
      )}
      {conformation ? (
        <CModel
          filter={"conformation"}
          isLoading={isTaskLoading}
          open={conformation}
          setOpen={setConformation}
          handleClick={handleDelete}
          title="Are you sure?"
        />
      ) : (
        ""
      )}
      {canViewTaskList && (
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
                  / Task
                </Typography>
              </Stack>
            </Breadcrumbs>
            <div style={{ display: "flex", gap: "10px" }}>
              {canExportTask && (
                <Button
                  onClick={handleExport}
                  variant="outlined"
                  startIcon={<Iconify icon="ph:download-fill" />}
                >
                  Export Tasks
                </Button>
              )}
              {canAddTask && (
                <Button
                  onClick={handleOpenModel}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  New Task
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
                label={"Search task.."}
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />

              <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                count={tasks.length}
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
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tasks.length}
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
                          pmkNumber,
                          heatNo,
                          description,
                          status,
                          image,
                        } = row;
                        return (
                          <TableRow hover key={id} tabIndex={-1}>
                            {/* <TableCell align="left">
                              {image ? (
                                <img
                                  alt="task"
                                  style={{ width: "50px", height: "40px" }}
                                  src={image}
                                  onClick={() => openFullscreen(image)}
                                />
                              ) : (
                                "_"
                              )}
                            </TableCell> */}
                            <TableCell align="left">
                              {image ? (
                                <>
                                  <img
                                    alt="task"
                                    style={{ width: "50px", height: "40px" }}
                                    src={image}
                                    onClick={() => openFullscreen(image)}
                                  />
                                  <div
                                    style={{
                                      display: "flex",
                                      marginLeft: "-15px",
                                      marginTop: "5px",
                                    }}
                                  >
                                    {canMakeCall && (
                                      <IconButton
                                        onClick={() => handleOpenCallModel()}
                                      >
                                        <Iconify
                                          icon="material-symbols:call"
                                          style={{
                                            height: "1rem",
                                            width: "1rem",
                                          }}
                                        />
                                      </IconButton>
                                    )}
                                    {openCallModel ? (
                                      <CModel
                                        open={openCallModel}
                                        setOpen={setOpenCallModel}
                                        filter={"call-list"}
                                      />
                                    ) : (
                                      ""
                                    )}
                                    {canDownloadDiagram && (
                                      <IconButton
                                        onClick={() => handleDownload(image)}
                                      >
                                        <Iconify
                                          icon="material-symbols:download"
                                          style={{
                                            height: "1rem",
                                            width: "1rem",
                                          }}
                                        />
                                      </IconButton>
                                    )}
                                    {canViewWhiteboard && (
                                      <IconButton
                                        onClick={() => handleCollaborate()}
                                      >
                                        <Iconify
                                          icon="carbon:collaborate"
                                          style={{
                                            height: "1rem",
                                            width: "1rem",
                                          }}
                                        />
                                      </IconButton>
                                    )}
                                  </div>
                                </>
                              ) : (
                                "_"
                              )}
                            </TableCell>

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
                                  {pmkNumber}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">{heatNo}</TableCell>
                            <TableCell align="left">
                              {description ? description : "_"}
                            </TableCell>
                            <TableCell align="left">
                              <Label
                                color={
                                  status === "approved"
                                    ? "success"
                                    : status === "in_process"
                                    ? "default"
                                    : status === "pending"
                                    ? "warning"
                                    : "error"
                                }
                              >
                                {sentenceCase(status)}
                              </Label>
                            </TableCell>

                            <TableCell
                              align="right"
                              style={{ display: "flex", marginTop: "50px" }}
                            >
                              {canEditTask && (
                                <MenuItem
                                  key={id}
                                  onClick={() => {
                                    dispatch(getSingleTasks(id)).then((res) => {
                                      setSelectedRow(row);
                                      setOpenUpdateModel(!openUpdateModel);
                                    });
                                  }}
                                >
                                  <Iconify icon={"eva:edit-fill"} />
                                </MenuItem>
                              )}
                              {canDeleteTask && (
                                <MenuItem
                                  sx={{ color: "error.main" }}
                                  onClick={() => {
                                    setConformation(true);
                                    setDeleteId(id);
                                  }}
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
              count={tasks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      )}
      <Modal
        open={isFullscreenOpen}
        onClose={closeFullscreen}
        aria-labelledby="image-modal"
        aria-describedby="image-modal-description"
      >
        <div>
          <button
            onClick={closeFullscreen}
            style={{
              position: "absolute",
              top: "8%",
              right: "3%",
              padding: "10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "black",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            <Iconify icon="mingcute:close-fill" />
          </button>

          <img
            alt="fullscreen"
            style={{ width: "100%", height: "600px", marginTop: "25px" }}
            src={fullscreenImage}
          />
        </div>
      </Modal>
    </>
  );
}
