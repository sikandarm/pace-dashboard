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
import { createSequencetask } from "../../feature/sequenceSlice";

const AddSequencetask = (props) => {
  // console.log(props.data[0].jobid, "++++++++"); ///Sequenceid ///
  const dispatch = useDispatch();
  //   const [SequenceName, setSequenceName] = useState("");
  const [taskid, settaskid] = useState("");
  const [task, settask] = useState([]);

  useEffect(() => {
    const gettask = async () => {
      const res = await ApiCall.get(
        `/sequencestask/indenpendent-task/${props.data[0].jobid}`
      );
      //   console.log(res.data.data, "++++ssss++");
      settask(res.data.data);
    };
    gettask();
  }, []);

  const handleSubmit = () => {
    if (!taskid) {
      showErrorToast("Please select a Task");
      return;
    }

    // if (!validateInput("sequenceName", SequenceName)) {
    //   return;
    // }
    const sequencetaskData = {
      sequence_id: props.data[0]?.sequenceid,
      task_id: taskid,
    };

    dispatch(createSequencetask(sequencetaskData)).then((res) => {
      if (res.type === "createSequencetask/SequenceTask/fulfilled") {
        const { message } = res.payload;
        showSuccessToast(message);
        props.setOpen(false);
      }
      if (res.type === "createSequencetask/SequenceTask/rejected") {
        // const { message } = res.error;
        showErrorToast("SequenceTask Not Created! Some Thing Went Wrong!");
      }
    });
  };

  const handleJobSelection = (event) => {
    settaskid(event.target.value);
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
        <p>Add Sequence Task</p>
      </div>
      <div>
        <FormControl fullWidth>
          <InputLabel htmlFor="label">Select Task</InputLabel>
          <Select value={taskid} onChange={handleJobSelection} id="label">
            <MenuItem value="">
              <em>Select a Task</em>
            </MenuItem>
            {task.map((dataItem) => (
              <MenuItem key={dataItem.id} value={dataItem.id}>
                {dataItem.pmkNumber}
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

export default AddSequencetask;
