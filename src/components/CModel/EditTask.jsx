import { useMemo, useState } from "react";
import CTextField from "../CTextField/CTextField";
import {
  Autocomplete,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Modal,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CSelect from "../CSelect/CSelect";
import { updateTasks } from "../../feature/tasksSlice";
import { toast } from "react-toastify";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

const EditTask = (props) => {
  const { currentTask, errorValue } = useSelector((state) => state.tasksSlice);
  const dispatch = useDispatch();
  const [data, setData] = useState({
    heatNo: currentTask.heatNo,
    description: currentTask.description,
    comments: currentTask.comments ? currentTask.comments : "",
    projectManager: currentTask.projectManager,
    QCI: currentTask.QCI,
    fitter: currentTask.fitter,
    welder: currentTask.welder,
    painter: currentTask.painter,
    foreman: currentTask.foreman,
  });

  const [status, setSelectedStatus] = useState(currentTask.status);
  const [userId, setSelectedUserId] = useState(currentTask.userId);

  const currentTaskStartDate = currentTask.startedAt
    ? dayjs(currentTask.startedAt)
    : null;
  const currentTaskEndDate = currentTask.completedAt
    ? dayjs(currentTask.completedAt)
    : null;
  const [selectedFile, setSelectedFile] = useState(null);
  const [perviewImage, setPerviewImage] = useState(currentTask.image);
  const selectData = [
    { id: 1, name: "Pending", value: "pending" },
    { id: 2, name: "Approved", value: "approved" },
    { id: 3, name: "Rejected", value: "rejected" },
    { id: 4, name: "In Process", value: "in_process" },
    { id: 5, name: "To Inspect", value: "to_inspect" },
  ];

  const [jodId, setJobId] = useState(currentTask.jobId);
  const [estimatedHour, setEstimatedHour] = useState(currentTask.estimatedHour);
  const [selectedReasons, setSelectedReasons] = useState(
    currentTask.rejectionReason
      ? currentTask.rejectionReason // Extracting names from objects
      : []
  );
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const openFullscreen = (image) => {
    setFullscreenImage(image);
    setIsFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    setIsFullscreenOpen(false);
  };
  const handleChange = (event) => {
    if (event.target.name === "estimatedHour") {
      setEstimatedHour(event.target.value);
    } else {
      setData((prv) => ({ ...prv, [event.target.name]: event.target.value }));
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPerviewImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPerviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("heatNo", data.heatNo);
    formData.append("description", data.description);
    formData.append("estimatedHour", Number(estimatedHour));
    formData.append("comments", data.comments);
    formData.append("jobId", Number(jodId));
    formData.append("status", status);
    formData.append("userId", userId);
    formData.append("projectManager", data.projectManager);
    formData.append("QCI", data.QCI);
    formData.append("fitter", data.fitter);
    formData.append("welder", data.welder);
    formData.append("painter", data.painter);
    formData.append("foreman", data.foreman);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    if (currentTaskStartDate) {
      formData.append("startedAt", currentTaskStartDate.toISOString());
    }
    if (currentTaskEndDate) {
      formData.append("completedAt", currentTaskEndDate.toISOString());
    }
    selectedReasons.forEach((value, index) => {
      formData.append("rejectionReason", value);
    });

    dispatch(updateTasks({ formData: formData, id: currentTask.id })).then(
      (res) => {
        if (res.type === "updateTasks/tasks/fulfilled") {
          props.setOpen(false);
          toast.success("Updated successfully !", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        if (res.type === "updateTasks/tasks/rejected") {
          props.setOpen(true);
          toast.error(errorValue, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    );
  };

  const remainingReasons = useMemo(
    () =>
      props.reasons.filter((reason) => !selectedReasons.includes(reason.name)),
    [props.reasons, selectedReasons]
  );

  const handleReasonsChange = (event, newValue) => {
    setSelectedReasons(newValue);
  };

  return (
    <div
      style={{
        overflowY: selectedFile || perviewImage ? "scroll" : "",
        maxHeight: "550px",
        overflowX: "hidden",
      }}
    >
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
        <h3>Edit Task</h3>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ width: "50%" }}>
            <CTextField
              defaultValue={data.heatNo}
              margin="5px 0px"
              width={300}
              fullWidth={false}
              onChange={handleChange}
              name="heatNo"
              label="Heat Number"
            />
          </div>

          <CSelect
            label="Select Job"
            data={props.jobs}
            jobId={props.data.jobId}
            initialValue={jodId}
            setinitialValue={setJobId}
            padding={"0px 8px"}
          />
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <CTextField
            defaultValue={data.description}
            margin="5px 0px"
            fullWidth={false}
            onChange={handleChange}
            name="description"
            label="Description"
          />
        </div>
        <div style={{ width: "50%" }}>
          <CTextField
            defaultValue={data.projectManager}
            margin="5px 0px"
            width={300}
            fullWidth={false}
            onChange={handleChange}
            name="projectManager"
            label="Project Manager"
          />
        </div>
        <div style={{ width: "50%" }}>
          <CTextField
            defaultValue={data.QCI}
            margin="5px 0px"
            width={300}
            fullWidth={false}
            onChange={handleChange}
            name="QCI"
            label="QCI"
          />
        </div>
        <div style={{ width: "50%" }}>
          <CTextField
            defaultValue={data.fitter}
            margin="5px 0px"
            width={300}
            fullWidth={false}
            onChange={handleChange}
            name="fitter"
            label="Fitter"
          />
        </div>
        <div style={{ width: "50%" }}>
          <CTextField
            defaultValue={data.welder}
            margin="5px 0px"
            width={300}
            fullWidth={false}
            onChange={handleChange}
            name="welder"
            label="Welder"
          />
        </div>
        <div style={{ width: "50%" }}>
          <CTextField
            defaultValue={data.painter}
            margin="5px 0px"
            width={300}
            fullWidth={false}
            onChange={handleChange}
            name="painter"
            label="Painter"
          />
        </div>
        <div style={{ width: "50%" }}>
          <CTextField
            defaultValue={data.foreman}
            margin="5px 0px"
            width={300}
            fullWidth={false}
            onChange={handleChange}
            name="foreman"
            label="Foreman"
          />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "10px 0px",
          }}
        >
          <div style={{ width: "50%" }}>
            <CTextField
              required={true}
              defaultValue={estimatedHour}
              margin="5px 0px"
              width={300}
              fullWidth={false}
              onChange={handleChange}
              name="estimatedHour"
              label="Estimated Hour"
            />
          </div>
          <div style={{ width: "50%" }}>
            <CSelect
              key={userId}
              disabled={false}
              label="Assign To:"
              data={props.users}
              initialValue={userId}
              setinitialValue={setSelectedUserId}
              padding={"0px 0px"}
              filter="users"
            />
          </div>
        </div>
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <h3>Task Status</h3>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div style={{ width: "50%" }}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Select Status</InputLabel>
                <Select
                  fullWidth
                  label="Select Status"
                  labelId="status-label"
                  margin="dense"
                  variant="outlined"
                  sx={{ textAlign: "left" }}
                  value={status}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                >
                  {selectData.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {status === "rejected" && (
              <div style={{ width: "50%" }}>
                <FormControl fullWidth>
                  <Autocomplete
                    fullWidth
                    multiple
                    margin="dense"
                    variant="outlined"
                    options={remainingReasons.map((reason) => reason.name)}
                    getOptionLabel={(option) => option}
                    value={selectedReasons}
                    onChange={handleReasonsChange}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option} // Use a unique identifier here
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select Reasons"
                        placeholder="Select Reasons"
                      />
                    )}
                    disabled={status === "rejected" ? false : true}
                  />
                </FormControl>
              </div>
            )}
          </div>
          {status === "approved" || status === "rejected" ? (
            <CTextField
              defaultValue={data.comments}
              margin="10px 0px"
              // width={300}
              fullWidth={false}
              onChange={handleChange}
              name="comments"
              label="Comment"
              disabled={
                status === "rejected" || status === "approved" ? false : true
              }
            />
          ) : null}
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <DateTimePicker
                    sx={{ width: "100%" }}
                    label="Started At"
                    value={currentTaskStartDate}
                    readOnly
                  />
                  <DateTimePicker
                    sx={{ width: "100%" }}
                    label="Completed At"
                    value={currentTaskEndDate}
                    readOnly
                  />
                </div>
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
        {perviewImage ? (
          <div style={{ width: "100%", textAlign: "center" }}>
            <img
              alt="task"
              style={{
                width: "700px",
                height: "350px",
                objectFit: "contain",
                marginBottom: "10px",
              }}
              src={perviewImage}
              onClick={() => openFullscreen(perviewImage)}
            />
          </div>
        ) : (
          ""
        )}
        <CTextField name="File" type="file" onChange={handleFileChange} />
        <Button
          disabled={props.isLoading}
          onClick={handleSubmit}
          variant="outlined"
          sx={{ width: "100%", margin: "10px 0px 0px 0px" }}
        >
          {props.isLoading ? "Loading.." : " Submit"}
        </Button>
      </div>
      <Modal
        open={isFullscreenOpen}
        onClose={closeFullscreen}
        aria-labelledby="image-modal"
        aria-describedby="image-modal-description"
      >
        <div>
          <button
            onClick={closeFullscreen}
            style={{
              position: "absolute",
              top: "8%",
              right: "3%",
              padding: "10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "black",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            X
          </button>

          <img
            alt="fullscreen"
            style={{ width: "100%", height: "auto", marginTop: "30px" }}
            src={fullscreenImage}
          />
        </div>
      </Modal>
    </div>
  );
};

export default EditTask;
