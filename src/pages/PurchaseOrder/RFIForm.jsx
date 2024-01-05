import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import { TextField, Button, Grid, CircularProgress } from "@mui/material";
import ApiCall from "../../utils/apicall";
function RFIForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    requestedof: "",
    attn: "",
    project: "",
    reference: "",
    RFI_N: "",
    OF: "",
    date: "",
    cc: "",
    information: "",
    suggestions: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendPDFToAPI = async () => {
    try {
      setLoading(true); // Set loading to true when starting the request
      const response = await ApiCall.post("/mail/sendmail", { formData });
      console.log(response, "+_+_+_+");

      if (response.data.data === "RFI sent successfully!") {
        // Handle success
        showSuccessToast("RFI Sent Successfully!");
        navigate("/purchaseorder");
      } else {
        // Handle error
        showErrorToast("Contacts Not Found! To Send RFI");
      }
    } catch (error) {
      console.error("Error sending PDF to API", error);
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="requestedof"
            label="Requested Of"
            type="text"
            variant="outlined"
            fullWidth
            value={formData.requestedof}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="attn"
            label="ATTN"
            type="text"
            variant="outlined"
            fullWidth
            value={formData.attn}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="project"
            label="PROJECT"
            type="text"
            variant="outlined"
            fullWidth
            value={formData.project}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="reference"
            label="REFERENCE"
            type="text"
            variant="outlined"
            fullWidth
            value={formData.reference}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="RFI_N"
            label="RFI Nº"
            type="text"
            variant="outlined"
            fullWidth
            value={formData.RFI_N}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="OF"
            label="O.F."
            type="text"
            variant="outlined"
            fullWidth
            value={formData.OF}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="date"
            label="DATE"
            type="date"
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="cc"
            label="CC"
            type="text"
            variant="outlined"
            fullWidth
            value={formData.cc}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            name="information"
            label="INFORMATION REQUESTED:"
            type="text"
            variant="outlined"
            fullWidth
            value={formData.information}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            name="suggestions"
            label="SUGGESTIONS:"
            type="text"
            variant="outlined"
            fullWidth
            value={formData.suggestions}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={sendPDFToAPI}
        style={{ marginTop: "10px" }}
        disabled={loading} // Disable the button when loading
      >
        {loading ? <CircularProgress size={24} /> : "Submit"}
      </Button>
    </div>
  );
}

export default RFIForm;
