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
import { validateInput } from "../../utils/validateInput";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import ApiCall from "../../utils/apicall";
import { createSequence } from "../../feature/sequenceSlice";

const AddSequence = (props) => {
  const dispatch = useDispatch();
  const [SequenceName, setSequenceName] = useState("");
  const [jobid, setJobid] = useState("");
  const [job, setjob] = useState([]);
  useEffect(() => {
    const getjob = async () => {
      const res = await ApiCall.get("/job");
      setjob(res.data.data.jobs);
    };
    getjob();
  }, []);

  const handleSubmit = () => {
    if (!jobid) {
      showErrorToast("Please select a job");
      return;
    }
    if (!validateInput("sequenceName", SequenceName)) {
      return;
    }
    const sequenceData = {
      sequence_name: SequenceName,
      job_id: jobid,
    };
    dispatch(createSequence(sequenceData)).then((res) => {
      if (res.type === "createSequence/Sequence/fulfilled") {
        const { message } = res.payload;
        showSuccessToast(message);
        props.setOpen(false);
      }
      if (res.type === "createSequence/Sequence/rejected") {
        // const { message } = res.error;
        showErrorToast("Sequence Not Created! Some Thing Went Wrong!");
      }
    });
  };

  const handleJobSelection = (event) => {
    setJobid(event.target.value);
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
        <p>Add Sequence</p>
      </div>
      <div>
        <CTextField
          margin="15px 0px"
          onChange={(event) => {
            setSequenceName(event.target.value);
          }}
          name="sequence_name"
          label="Name"
          required={true}
        />
        <FormControl fullWidth>
          <InputLabel htmlFor="label">Select Job</InputLabel>
          <Select
            value={jobid}
            onChange={handleJobSelection}
            name="label"
            label="Select Job"
            margin="dense"
            variant="outlined"
            sx={{ textAlign: "left" }}
          >
            <MenuItem value="">
              <em>Select a Job</em>
            </MenuItem>
            {job.map((dataItem) => (
              <MenuItem key={dataItem.id} value={dataItem.id}>
                {dataItem.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default AddSequence;
