// FabricatedItemDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HomeRounded } from "@material-ui/icons";

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
  Card,
} from "@mui/material";
import Iconify from "@iconify/react";

import ApiCall from "../../utils/apicall";

const FabricatedItemDetail = () => {
  const { uniqueName } = useParams();
  console.log(uniqueName, "+_+_+_+_+");
  const navigate = useNavigate();

  const [fabricatedItems, setFabricatedItems] = useState([]);
  // const [poItems, setPoItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch fabricated items based on the uniqueName
        const fabricatedItemsResponse = await ApiCall.get(
          `/fabricated-items/get-items-byname/${uniqueName}`
        );
        console.log(fabricatedItemsResponse, "+_+_+_");
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

  // const handleBackClick = () => {
  //   navigate("/fabricated-items"); // Adjust the URL as needed
  // };
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fabricatedItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.POItemName}</TableCell>
                      <TableCell align="right" style={{ display: "flex" }}>
                        <MenuItem
                          sx={{ color: "error.main" }}
                          onClick={() => handleOpenUpdate(item)}
                        >
                          <Iconify icon={"eva:info-outline"} />
                        </MenuItem>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">Fabricated Item Not found</Typography>
          )}
        </Paper>

        {/* <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
          onClick={handleBackClick}
        >
          Back
        </Button> */}
      </Container>
    </div>
  );
};

export default FabricatedItemDetail;
