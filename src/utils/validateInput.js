import { showErrorToast } from "./Toast";

export const validateInput = (name, value) => {
  switch (name) {
    case "role":
      if (!value) {
        showErrorToast("Please select a role.");
        return false;
      }
      break;
    case "firstName":
      if (!value || value.trim() === "") {
        showErrorToast("Please enter a valid first name.");
        return false;
      }
      break;
    case "lastName":
      if (!value || value.trim() === "") {
        showErrorToast("Please enter a valid last name.");
        return false;
      }
      break;
    case "email":
      if (!value || value.trim() === "") {
        showErrorToast("Please enter a valid email address.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showErrorToast("Please enter a valid email address.");
        return false;
      }

      break;
    case "password":
      if (!value || value.trim() === "") {
        showErrorToast("Please enter a password.");
        return false;
      }
      if (value.length < 5) {
        showErrorToast("Password must be at least 5 characters long.");
        return false;
      }
      break;
    case "phone":
      if (value.length < 12) {
        showErrorToast("Phone number must be valid");
        return false;
      }
      break;
    case "jobName":
      if (!value || value.trim() === "") {
        showErrorToast("Please enter a valid Job Name.");
        return false;
      }
      break;
    case "jobstatus":
      if (!value || value.trim() === "") {
        showErrorToast("Please select a job status.");
        return false;
      }
      break;
    case "sequenceName":
      if (!value || value.trim() === "") {
        showErrorToast("Please Enter a Sequence Name.");
        return false;
      }
      break;

    default:
      break;
  }
  return true;
};
