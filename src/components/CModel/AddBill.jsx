import React, { useEffect, useState } from "react";
import CTextField from "../CTextField/CTextField";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useDispatch } from "react-redux";
// import { validateInput } from "../../utils/validateInput";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import ApiCall from "../../utils/apicall";
import { createBill } from "../../feature/shippinglistSlice";

const AddBill = (props) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState("");
  const [billid, setbillid] = useState("");
  const [bill, setbill] = useState([]);
  const [poid, setpoid] = useState("");
  const [po, setpo] = useState([]);

  useEffect(() => {
    const getitem = async () => {
      const res = await ApiCall.get("/fabricated-items/getall-fabricated-item");
      // Use Set to store unique IDs
      const uniqueJobIds = new Set();
      // Filter out duplicates
      const filteredJob = res.data.data.filter((dataItem) => {
        // console.log(dataItem);
        if (!uniqueJobIds.has(dataItem.name)) {
          uniqueJobIds.add(dataItem.name);
          return true;
        }
        return false;
      });
      setbill(filteredJob);
    };
    getitem();
  }, []);
  useEffect(() => {
    const getitem = async () => {
      const res = await ApiCall.get("/purchaseorder");
      //   console.log(res.data.data.purchaseOrders);
      // Use Set to store unique IDs
      // const uniqueJobIds = new Set();
      // // Filter out duplicates
      // const filteredJob = res.data.data.filter((dataItem) => {
      //   console.log(dataItem);
      //   if (!uniqueJobIds.has(dataItem.name)) {
      //     uniqueJobIds.add(dataItem.name);
      //     return true;
      //   }
      //   return false;
      // });
      setpo(res.data.data.purchaseOrders);
    };
    getitem();
  }, []);

  const handleSubmit = () => {
    if (!billid) {
      showErrorToast("Please select a Item");
      return;
    }
    if (!quantity) {
      showErrorToast("Please Enter Quantity");
      return;
    }
    const billData = {
      fabricated_items: billid,
      purchase_order: poid,
      quantity: quantity,
    };

    dispatch(createBill(billData)).then((res) => {
      //   console.log(res, "res");
      if (res.type === "createBill/Bill/fulfilled") {
        const message = "Bill Created Successfully!";
        showSuccessToast(message);
        props.setOpen(false);
      }
      if (res.type === "createBill/Bill/rejected") {
        // const { message } = res.error;
        showErrorToast("Bill Already Exist!");
      }
    });
  };

  const handlebillSelection = (event) => {
    setbillid(event.target.value);
  };
  const handlepoSelection = (event) => {
    setpoid(event.target.value);
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          background: "#2065D1",
          borderRadius: 10,
          color: "white",
          marginBottom: "20px",
        }}
      >
        <p>Bill of Lading</p>
      </div>
      <div>
        <FormControl fullWidth style={{ marginBottom: "15px" }}>
          <InputLabel htmlFor="label">Select Fabricated Item</InputLabel>
          <Select value={billid} onChange={handlebillSelection} id="label">
            <MenuItem value="">
              <em>Select Fabricated Item</em>
            </MenuItem>
            {bill.map((dataItem) => (
              <MenuItem key={dataItem.id} value={dataItem.id}>
                {dataItem.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel htmlFor="label">Select PO</InputLabel>
          <Select value={poid} onChange={handlepoSelection} id="label">
            <MenuItem value="">
              <em>Select PO Number</em>
            </MenuItem>
            {po.map((dataItem) => (
              <MenuItem key={dataItem.id} value={dataItem.id}>
                {dataItem.po_number}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <CTextField
          margin="15px 0px"
          onChange={(event) => {
            setQuantity(event.target.value);
          }}
          name="quantity "
          label="Quantity"
          required={true}
        />

        <Button
          disabled={props.isLoading}
          onClick={handleSubmit}
          variant="outlined"
          sx={{ width: "100%", margin: "10px 0px 0px 0px" }}
        >
          {props.isLoading ? "Loading.." : " Submit"}
        </Button>
      </div>
    </div>
  );
};

export default AddBill;
