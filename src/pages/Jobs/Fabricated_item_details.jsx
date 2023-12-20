import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HomeRounded } from "@material-ui/icons";
import Iconify from "../../components/iconify";

import {
  Container,
  Stack,
  Breadcrumbs,
  Typography,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  // Card,
} from "@mui/material";

import ApiCall from "../../utils/apicall";
import { useSelector } from "react-redux";
import { hasPermission, PERMISSIONS } from "../../utils/hasPermission";

const FabricatedItemDetail = () => {
  const { uniqueName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  // console.log(state, "STATE");
  const [fabricatedItems, setFabricatedItems] = useState([]);
  // console.log(fabricatedItems);
  // const [poItems, setPoItems] = useState([]);
  const { loginUser } = useSelector((state) => state.userSlice);
  const { permissions: userPermissions } = loginUser.decodedToken;
  const canUpdateFabricatedItems = hasPermission(
    userPermissions,
    PERMISSIONS.Update_FabricatedItems
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch fabricated items based on the uniqueName
        const fabricatedItemsResponse = await ApiCall.get(
          `/fabricated-items/get-items-byname/${uniqueName}`
        );
        // console.log(fabricatedItemsResponse, "+_+_+_");
        setFabricatedItems(fabricatedItemsResponse.data.data);

        // Fetch PO items associated with the fabricated item
        // const poItemsResponse = await ApiCall.get(
        //   `/fabricated-items/get-poitems-by-name/${uniqueName}`
        // );
        // setPoItems(poItemsResponse.data.data);
      } catch (error) {
        console.error(error);
        // Handle error appropriately
      }
    };

    fetchData();
  }, [uniqueName]);

  const handleBackClick = (id) => {
    navigate(`/detail-Job/${id}`);
  };
  const handleOpenUpdate = (id, item) => {
    navigate(`/update-items/${id}`, { state: { item } });
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

        <Paper>
          {fabricatedItems && fabricatedItems.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fabricated Item Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>PoItems</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fabricatedItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.POItemName}</TableCell>
                      <TableCell>
                        {canUpdateFabricatedItems && (
                          <MenuItem
                            sx={{ color: "error.main" }}
                            onClick={() => handleOpenUpdate(item.id, item)}
                          >
                            <Iconify icon={"eva:edit-fill"} />
                          </MenuItem>
                        )}
                      </TableCell>
                      {/* <TableCell align="right" style={{ display: "flex" }}>
                        <MenuItem
                          sx={{ color: "error.main" }}
                          onClick={() => handleOpenUpdate(item)}
                        >
                          <Iconify icon={"eva:info-outline"} />
                        </MenuItem>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">Fabricated Item Not found</Typography>
          )}
        </Paper>

        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
          onClick={() => handleBackClick(state.id)}
        >
          Back
        </Button>
      </Container>
    </div>
  );
};

export default FabricatedItemDetail;
