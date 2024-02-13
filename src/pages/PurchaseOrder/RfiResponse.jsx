import React, { useState, useEffect } from "react";
import ApiCall from "../../utils/apicall";

import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { filter } from "lodash";
import { UserListToolbar } from "../../sections/@dashboard/user";

import {
  Container,
  Table,
  TableHead,
  Typography,
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  DialogActions,
  TableCell,
  MenuItem,
  Breadcrumbs,
  TableRow,
  TablePagination,
  Stack,
  Button,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import { HomeRounded } from "@material-ui/icons";
import Iconify from "../../components/iconify";
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

const FileUploader = () => {
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);

  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchFiles();
  }, []); // Fetch files on component mount

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAddFile = async () => {
    try {
      if (file === null) {
        toast.error("Please select a file to upload");
        return;
      }

      // Check file type
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);

      const response = await ApiCall.post("/mail/sendfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast("File uploaded successfully!");
        setFile(null);
        fetchFiles(); // Fetch updated files after upload
        handleClose();
      } else {
        console.error("File upload failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await ApiCall.get("/mail/getfile");
      setFiles(response.data.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleViewFile = (file) => {
    // const fileToView = files.find((file) => file.id === fileId);
    if (file) {
      const fileUrl = `http://206.81.5.26:3500/uploads/rfi_reports/${file}`;
      window.open(fileUrl, "_blank");
    } else {
      console.error("File not found with ID:", file);
    }
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - files.length) : 0;
  // const isNotFound = !files.length && !!filterName;

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(
        files,
        (_inv) => _inv.file.toLowerCase().indexOf(query.toLowerCase()) !== -1
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
  const filteredUsers = applySortFilter(
    files,
    getComparator(order, orderBy),
    filterName
  );
  const isNotFound = !filteredUsers.length && !!filterName;
  const handleOpenModel = () => {
    setOpen(true);
  };
  const handleClose = () => {
    // setFormErrors("");
    //  setOpenUpdateModel(false);
    setOpen(false);
  };

  const handledeleteFile = async (id) => {
    const deletedata = await ApiCall.delete(`/mail/deletefile/${id}`);
    if (deletedata) {
      fetchFiles();
      toast("File Deleted successfully!");
    }
  };

  return (
    <div>
      <Helmet>
        <title>RFI | Pace RFI</title>
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
                  / RFI Response
                </Typography>
              </Stack>
            </Breadcrumbs>

            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenModel}
            >
              Upload RFI Response
            </Button>
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
              <UserListToolbar
                label={"Search File.."}
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />
              <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                count={files.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
            <Table>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Upload File</DialogTitle>
                <DialogContent>
                  <form style={{ marginTop: "5px" }}>
                    <TextField
                      // label="Name"
                      variant="outlined"
                      type="file"
                      fullWidth
                      onChange={handleFileChange}
                    />
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleAddFile} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>{file.file}</TableCell>
                      <TableCell style={{ display: "flex" }}>
                        <MenuItem
                          variant="contained"
                          onClick={() => handleViewFile(file.file)}
                        >
                          <Iconify icon={"eva:info-outline"} />
                        </MenuItem>
                        <MenuItem
                          variant="contained"
                          onClick={() => handledeleteFile(file.id)}
                        >
                          <Iconify icon={"eva:trash-2-outline"} />
                        </MenuItem>
                      </TableCell>
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

export default FileUploader;
