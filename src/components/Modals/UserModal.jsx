import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createUser, updateUser } from "../../feature/userSlice";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import { validateInput } from "../../utils/validateInput";

const UserModal = (props) => {
  const { user } = props;
  const dispatch = useDispatch();

  const [data, setData] = useState({
    firstName: user ? user.firstName : "",
    lastName: user ? user.lastName : "",
    email: user ? user.email : "",
    password: user ? user.password : "",
    ratePerHour: user ? user.ratePerHour : "",
  });

  const [selectedRole = ""] = user?.roles || [];

  const [role, setRole] = useState(user ? selectedRole?.id : "");
  const [phone, setPhone] = useState(user ? user.phone : "");
  const [isActive, setIsActive] = useState(user ? user.isActive : false);

  const { roles } = useSelector((state) => state.roleSlice);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatPhoneNumber = (input) => {
    const numbersOnly = input.replace(/\D/g, "");
    let formattedValue = "";
    if (numbersOnly.length > 0) {
      formattedValue += numbersOnly.slice(0, 3);
    }
    if (numbersOnly.length >= 4) {
      formattedValue += `-${numbersOnly.slice(3, 6)}`;
    }
    if (numbersOnly.length >= 7) {
      formattedValue += `-${numbersOnly.slice(6, 11)}`;
    }
    return formattedValue;
  };

  const handlePhoneChange = (event) => {
    const input = event.target.value;
    const formattedValue = formatPhoneNumber(input);
    setPhone(formattedValue);
  };

  const handleSubmit = () => {
    console.log("==-==-=", data.ratePerHour);
    if (!data.ratePerHour) {
      showErrorToast("Please Add User RatePerHour");
      return;
    }
    if (!phone) {
      showErrorToast("Please Add User Phone Number");
      return;
    }

    //Validate Role
    if (!validateInput("role", role)) {
      return;
    }

    if (!user) {
      for (const field of ["firstName", "lastName", "email", "password"]) {
        if (!validateInput(field, data[field])) {
          return;
        }
      }
    } else {
      // Validate User fields except password for Edit User mode
      for (const field of ["firstName", "lastName", "email"]) {
        if (!validateInput(field, data[field])) {
          return;
        }
      }
    }

    //Validate Phone number
    if (phone.length > 0) {
      if (!validateInput("phone", phone)) {
        return;
      }
    }

    const userData = {
      ...data,
      id: user?.id,
      phone,
      roleId: role,
      isActive,
    };
    if (user) {
      dispatch(updateUser(userData)).then((res) => {
        if (res.type === "update-users/users/rejected") {
          console.log(res);
          showErrorToast(res.payload);
        }
        if (res && res.payload.id) {
          showSuccessToast("User Updated Successfully !");
          handleClose();
        }
      });
    } else {
      dispatch(createUser(userData)).then((res) => {
        if (res.type === "create-users/users/rejected") {
          showErrorToast("User Already Exist");
        }
        if (res.payload.id) {
          showSuccessToast("User Created Successfully !");
          handleClose();
        }
      });
    }
  };

  const buttonLabel = props.isLoading
    ? "Loading..."
    : user
    ? "Update User"
    : "Create User";

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Modal
      open={props.isOpen}
      onClose={handleClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 24,
          p: 4,
          width: 400, // Adjust the width as needed
          textAlign: "center",
          borderRadius: "20px",
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="role-label">Select Role</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            label="Select Role"
            fullWidth
            margin="dense"
            variant="outlined"
            sx={{ textAlign: "left" }}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            defaultValue={data.firstName}
            margin="dense"
            onChange={handleInputChange}
            name="firstName"
            label="First Name"
          />
          <TextField
            defaultValue={data.lastName}
            margin="dense"
            onChange={handleInputChange}
            name="lastName"
            label="Last Name"
          />
          <TextField
            defaultValue={data.email}
            margin="dense"
            onChange={handleInputChange}
            name="email"
            label="Email"
          />
          {!user && (
            <TextField
              margin="dense"
              onChange={handleInputChange}
              name="password"
              label="Password"
              type="password"
            />
          )}
          <TextField
            margin="dense"
            value={phone}
            name="phone"
            label="Phone"
            fullWidth
            onChange={handlePhoneChange}
            onKeyDown={handlePhoneChange}
            placeholder="XXX-XXX-XXXX"
            inputMode="numeric"
            inputProps={{
              maxLength: 12,
            }}
          />
          <TextField
            defaultValue={data.ratePerHour}
            margin="dense"
            onChange={handleInputChange}
            name="ratePerHour"
            label="RatePerHour"
          />
          {user && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              Active
              <Switch
                label="Active"
                checked={isActive}
                onChange={() => setIsActive((prevIsActive) => !prevIsActive)}
                color="primary"
              />
            </span>
          )}
          <Button
            sx={{ marginTop: "10px", width: "100%" }}
            disabled={props.isLoading}
            onClick={handleSubmit}
            variant="contained"
          >
            {buttonLabel}
          </Button>
          {user && (
            <Button
              sx={{ marginTop: "10px", width: "100%" }}
              onClick={handleClose}
              variant="outlined"
            >
              Cancel
            </Button>
          )}
        </FormControl>
      </Box>
    </Modal>
  );
};

export default UserModal;
