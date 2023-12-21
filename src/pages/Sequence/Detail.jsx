import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ApiCall from "../../utils/apicall";
import { HomeRounded } from "@material-ui/icons";
import Iconify from "../../components/iconify";
import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";
import { useSelector } from "react-redux";
import CModel from "../../components/CModel/CModel";
import { useDispatch } from "react-redux";
import {
  // Card,
  Stack,
  Paper,
  Typography,
  Button,
  Breadcrumbs,
  Container,
  TableContainer,
  TableCell,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TablePagination,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { deletesequencetask } from "../../feature/sequenceSlice";

function Detail() {
  const { id } = useParams();
  const open = false;
  const [sequencetask, setsequencetask] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [openModel, setOpenModel] = useState(false);
  const { loginUser } = useSelector((state) => state.userSlice);
  const { sequence, isSequenceLoading } = useSelector(
    (state) => state.sequenceSlice
  );
  const [hasFetchedData, setHasFetchedData] = useState(false);

  const { permissions: userPermissions } = loginUser.decodedToken;
  const canAddSequence = hasPermission(
    userPermissions,
    PERMISSIONS.ADD_SEQUENCE
  );
  const canViewSequenceList = hasPermission(
    userPermissions,
    PERMISSIONS.VIEW_SEQUENCE
  );
  const location = useLocation();
  const { row } = location.state || {};
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();

  const handleBackClick = () => {
    navigate("/sequence");
  };

  const handleOpenModel = () => {
    setOpenModel(!open);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ApiCall.get(`/sequencestask/get-sequence-task/${id}`);
        if (res.data.data.length > 0) {
          setsequencetask(res.data.data || []);
        } else {
          setError("ss");
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
    if (sequence && sequence.length > 0 && !hasFetchedData) {
      const fetchData = async () => {
        try {
          const res = await ApiCall.get(
            `/sequencestask/get-sequence-task/${id}`
          );
          if (res.data.data.length > 0) {
            setsequencetask(res.data.data || []);
          } else {
            setError("ss");
          }
        } catch (error) {
          setError(error);
        }
      };

      fetchData();

      // Set hasFetchedData to true to prevent infinite loop
      setHasFetchedData(true);
    }
  }, [id, sequence, hasFetchedData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleDelete = (id) => {
    dispatch(deletesequencetask(id));
  };

  return (
    <div>
      <Helmet>
        <title>Sequence | Pace SequenceTask</title>
      </Helmet>
      {openModel ? (
        <CModel
          isLoading={isSequenceLoading}
          open={openModel}
          setOpen={setOpenModel}
          data={row}
          filter={"add-sequencetask"}
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
                  / Sequence Task
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
                  New Sequence Task
                </Button>
              )}
            </div>
          </Stack>

          <Paper>
            {error ? (
              <Typography variant="body1" style={{ marginTop: "10px" }}>
                Sequence Task Not Found!
              </Typography>
            ) : (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sequence Name</TableCell>
                        <TableCell>Task Pmk#</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sequencetask &&
                        sequencetask
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.SequenceName}</TableCell>
                              <TableCell>{item.TaskName}</TableCell>
                              <TableCell>
                                <MenuItem
                                  sx={{ color: "error.main" }}
                                  onClick={() => handleDelete(item.taskid)}
                                >
                                  <Iconify icon={"eva:trash-2-outline"} />
                                </MenuItem>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={sequencetask.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </Paper>

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
            onClick={handleBackClick}
          >
            Back
          </Button>
        </Container>
      )}
    </div>
  );
}

export default Detail;
