import React, { useState } from "react";
import CTextField from "../CTextField/CTextField";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import CSelect from "../CSelect/CSelect";
import { updateJob } from "../../feature/jobSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";

const EditJob = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    id: props.data.id,
    name: props.data.name,
    description: props.data.description,
    totalTasks: props.data.totalTasks ? props.data.totalTasks : 0,
    completedTasks: props.data.completedTasks ? props.data.completedTasks : 0,
  });

  const [status, setSelectedStatus] = React.useState(props.data.status);
  const [startDate, setJobStartDate] = useState(dayjs(props.data.startDate));
  const [endDate, setJobEndDate] = useState(
    props.data.endDate ? dayjs(props.data.endDate) : ""
  );
  const selectData = [
    { name: "Priority", value: "priority" },
    { name: "Completed", value: "completed" },
    { name: "In Process", value: "in_process" },
    // { name: 'test', value: 'inprocess' },
  ];
  const handleChange = (event) => {
    setData((prv) => ({ ...prv, [event.target.name]: event.target.value }));
  };
  const handleSubmit = () => {
    let finalData = { status, startDate, endDate, ...data };
    dispatch(updateJob(finalData)).then((res) => {
      if (res.type === "updateJobs/jobs/fulfilled") {
        const { message } = res.payload;
        showSuccessToast(message);
        props.setOpen(false);
      }
      if (res.type === "updateJobs/jobs/rejected") {
        const { message } = res.error;
        showErrorToast(message);
      }
    });
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
        <p>Edit Job</p>
      </div>
      <div>
        <CTextField
          margin="5px 0px"
          defaultValue={data.name}
          onChange={handleChange}
          name="name"
          label="Name"
        />
        <CTextField
          margin="5px 0px"
          defaultValue={data.description}
          onChange={handleChange}
          name="description"
          label="Description"
        />
        <CSelect
          label="Select Status"
          margin="5px 0px"
          padding="0px"
          data={selectData}
          initialValue={status}
          setinitialValue={setSelectedStatus}
        />
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  width: "100%",
                }}
              >
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setJobStartDate(newValue)}
                />

                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setJobEndDate(newValue)}
                />
              </div>
            </DemoContainer>
          </LocalizationProvider>
        </div>
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

export default EditJob;
