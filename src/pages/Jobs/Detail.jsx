import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ApiCall from "../../utils/apicall";
import { HomeRounded } from "@material-ui/icons";
import Iconify from "../../components/iconify";
import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";
import { useSelector } from "react-redux";
import {
  Card,
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
} from "@mui/material";
import { useState } from "react";

function Detail() {
  const { id } = useParams();
  const [fabricateditems, setfabricatedItems] = useState(null);
  const [Poitems, setPoItems] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loginUser } = useSelector((state) => state.userSlice);
  const { permissions: userPermissions } = loginUser.decodedToken;
  const canAddFabricatedItems = hasPermission(
    userPermissions,
    PERMISSIONS.Add_FabricatedItems
  );
  const canUpdateFabricatedItems = hasPermission(
    userPermissions,
    PERMISSIONS.Update_FabricatedItems
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ApiCall.get(
          `/fabricated-items/get-fabricated-item/${id}`
        );
        if (res.data.data.FabricatedItems.length > 0) {
          setfabricatedItems(res.data.data.FabricatedItems);
        } else {
          setError("ss");
        }
      } catch (error) {
        // console.log(error);
        setError(error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await ApiCall.get(
          `/fabricated-items/get-poitem-perjob/${id}`
        );
        // console.log(res.data.data, "=++++");
        setPoItems(res.data.data);
      } catch (error) {
        // console.log(error);
        setError(error);
      }
    };

    fetchItems();
  }, [id]);

  // useEffect(() => {
  //   fetchData();
  // }, []);
  // const fetchData = async () => {
  //   try {
  //     const res = await ApiCall.get(
  //       `/fabricated-items/get-fabricated-item/${id}`
  //     );
  //     setfabricatedItems(res.data.data.FabricatedItems);
  //     setPoItems(res.data.data.POInventoryItems);
  //   } catch (error) {
  //     console.log(error);
  //     setError(error);
  //   }
  // };

  const handleBackClick = () => {
    navigate("/jobs");
  };
  const handleOpenCreate = (id) => {
    navigate(`/create-items/${id}`);
  };
  const handleOpenUpdate = (fabricateditems) => {
    navigate(`/update-items/${id}`, { state: { fabricateditems } });
  };
  return (
    <div>
      <Helmet>
        <title>Sequence | Pace Fabricated Items</title>
      </Helmet>
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
                / Fabricated Items
              </Typography>
            </Stack>
          </Breadcrumbs>
        </Stack>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {fabricateditems && fabricateditems.length > 0
            ? canUpdateFabricatedItems && (
                <Button
                  onClick={() => handleOpenUpdate(fabricateditems)}
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  style={{ marginBottom: "15px" }}
                >
                  Update Item
                </Button>
              )
            : canAddFabricatedItems && (
                <Button
                  onClick={() => handleOpenCreate(id)}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  Add Item
                </Button>
              )}
        </div>

        <Paper>
          {error ? (
            <Typography variant="body1" style={{ marginTop: "10px" }}>
              Fabricated Item Not found
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fabricated Item Name</TableCell>
                    <TableCell>Fabricated Item Quantity</TableCell>
                    <TableCell></TableCell>
                    {/* <TableCell>Job Name</TableCell> */}
                    {/* <TableCell>PO Number</TableCell> */}
                    {/* <TableCell>PO Status</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fabricateditems &&
                    fabricateditems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        {/* <TableCell>{item.Job.name}</TableCell> */}
                        <TableCell>
                          {/* {item.Job.PurchaseOrder.po_number} */}
                        </TableCell>
                        {/* <TableCell>{item.Job.PurchaseOrder.status}</TableCell> */}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Paper style={{ marginTop: "10px" }}>
          <Card>
            {Poitems && Poitems.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>PurchaseOrder Items</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  {Poitems.map((item, index) => (
                    <TableBody key={index}>
                      <TableRow>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                      </TableRow>
                    </TableBody>
                  ))}
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1"></Typography>
            )}
          </Card>
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
    </div>
  );
}

export default Detail;
