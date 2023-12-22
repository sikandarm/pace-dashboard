import { useState } from "react";
import CTextField from "../CTextField/CTextField";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import CSelect from "../CSelect/CSelect";
// import CDatePicker from '../CDatePicker/CDatePicker';
import { createTask } from "../../feature/tasksSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditTask = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    heatNo: "",
    description: "",
    projectManager: "",
    QCI: "",
    fitter: "",
    welder: "",
    painter: "",
    foreman: "",
  });
  // const [status, setSelectedStatus] = useState('pending');
  const [userId, setSelectedUserId] = useState(null);
  // const [startDate, setJobStartDate] = useState();
  // const [endDate, setJobEndDate] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [perviewImage, setPerviewImage] = useState("");
  // const selectData = [
  //   { name: 'Pending', value: 'pending' },
  //   { name: 'Approved', value: 'approved' },
  //   { name: 'Rejected', value: 'rejected' },
  //   { name: 'In Process', value: 'in_process' },
  //   { name: 'To Inspect', value: 'to_inspect' },
  // ];
  const [jobId, setJobId] = useState(null);
  const [estimatedHour, setEstimatedHour] = useState(null);
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

  const handleSubmit = async () => {
    if (
      jobId === null ||
      data.heatNo.length === 0 ||
      data.estimatedHour === null ||
      userId === null
    ) {
      toast("Fill the required fields");
      return;
    }
    const formData = new FormData();
    formData.append("heatNo", data.heatNo);
    formData.append("description", data.description);
    formData.append("estimatedHour", Number(estimatedHour));
    formData.append("image", selectedFile);
    formData.append("jobId", Number(jobId));
    // formData.append('startedAt', startDate);
    // formData.append('completedAt', endDate);
    formData.append("status", "pending");
    formData.append("userId", Number(userId));
    formData.append("projectManager", data.projectManager);
    formData.append("QCI", data.QCI);
    formData.append("fitter", data.fitter);
    formData.append("welder", data.welder);
    formData.append("painter", data.painter);
    formData.append("foreman", data.foreman);
    try {
      const res = await dispatch(createTask(formData));
      if (res.type === "createTask/tasks/fulfilled") {
        props.setOpen(false);
        toast.success("Created successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

      if (res.type === "createTask/tasks/rejected") {
        props.setOpen(true);
        const { message: errorMessage } = res.error;
        toast.error(errorMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log("Error in handleSubmit:", error.message);
      toast.error(
        error.message || "Something went wrong. Please try again later.",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
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
        <h3>Add Task</h3>
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
              required={true}
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
            initialValue={jobId}
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
          }}
        >
          {/* <div style={{ width: '50%' }}>
            <CDatePicker label="Started At" date={startDate} setDate={setJobStartDate} />
          </div>
          <div style={{ width: '50%' }}>
            <CDatePicker label="Completed At" date={endDate} setDate={setJobEndDate} />
          </div> */}
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
              disabled={false}
              label="Assign To:"
              data={props.users}
              initialValue={userId}
              setinitialValue={setSelectedUserId}
              padding={"0px 0px"}
              filter="users"
              required
            />
          </div>
        </div>
        {/* <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <h3>Task Status</h3>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ width: '50%' }}>
              <CSelect
                disabled={true}
                label="Select Status"
                data={selectData}
                initialValue={status}
                setinitialValue={setSelectedStatus}
                padding={'0px 15px 0px 0px '}
              />
            </div>
            <div style={{ width: '50%' }}>
              <CTextField
                defaultValue={data.rejectionReason}
                margin="5px 0px"
                width={300}
                fullWidth={false}
                onChange={handleChange}
                name="rejectionReason"
                label="Rejection Reason"
                disabled={status === 'rejected' ? false : true}
              />
            </div>
          </div>
          <CTextField
            defaultValue={data.comments}
            margin="5px 0px"
            // width={300}
            fullWidth={false}
            onChange={handleChange}
            name="comments"
            label="Comment"
            disabled={status === 'rejected' || status === 'approved' ? false : true}
          />
        </div> */}
        {perviewImage ? (
          <div style={{ width: "100%", textAlign: "center" }}>
            <img
              alt="task"
              style={{ width: "700px", height: "350px" }}
              src={perviewImage}
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
    </div>
  );
};

export default EditTask;
