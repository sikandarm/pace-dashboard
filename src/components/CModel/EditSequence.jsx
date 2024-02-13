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
import { updateSequence } from "../../feature/sequenceSlice";

const EditSequence = (props) => {
  const dispatch = useDispatch();
  const [SequenceName, setSequenceName] = useState({
    sequence_name: props.data.sequence_name,
  });
  const [jobid, setJobid] = useState("");
  const [job, setjob] = useState([]);
  const [updatejob, setupdatejob] = useState(props ? props.data.jobid : "");

  useEffect(() => {
    const getjob = async () => {
      const res = await ApiCall.get("/job");
      setjob(res.data.data.jobs);
    };
    getjob();
  }, []);

  const handleSubmit = () => {
    if (!updatejob) {
      showErrorToast("Please select a job");
      return;
    }
    if (!SequenceName) {
      showErrorToast("Please Enter Sequence Name");
      return;
    }
    const sequenceData = {
      sequence_name: SequenceName.sequence_name,
      job_id: updatejob,
      id: props.data.id,
    };
    dispatch(updateSequence(sequenceData)).then((res) => {
      if (res.type === "updateSequence/Sequence/fulfilled") {
        const { message } = res.payload;
        showSuccessToast(message);
        props.setOpen(false);
      }
      if (res.type === "updateSequence/Sequence/rejected") {
        // const { message } = res.error;
        showErrorToast("Sequence Not Updated! Some Thing Went Wrong!");
      }
    });
  };

  const handleJobSelection = (event) => {
    setupdatejob(event.target.value);
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
        <p>Edit Sequence</p>
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
          defaultValue={SequenceName.sequence_name}
        />
        <FormControl fullWidth>
          <InputLabel htmlFor="label">Select Job</InputLabel>
          <Select
            value={updatejob}
            onChange={handleJobSelection}
            id="label"
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

export default EditSequence;
