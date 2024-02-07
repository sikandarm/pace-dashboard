export const validateContactForm = (newContact) => {
  let valid = true;
  const errors = {};

  const nameRegex = /^[a-zA-Z\s]+$/;
  const phoneRegex = /^\+\d{1,2}\s\(\d{3}\)\s\d{3}-\d{4}$/;

  if (newContact.firstName.trim() === "") {
    errors.firstName = "First Name is required";
    valid = false;
  } else if (!nameRegex.test(newContact.firstName.trim())) {
    errors.firstName = "First Name is invalid";
    valid = false;
  }

  if (newContact.lastName.trim() === "") {
    errors.lastName = "Last Name is required";
    valid = false;
  } else if (!nameRegex.test(newContact.lastName.trim())) {
    errors.lastName = "Last Name is invalid";
    valid = false;
  }

  if (!newContact.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(newContact.email)) {
    errors.email = "Email is invalid";
  }

  if (!newContact.phoneNumber) {
    errors.phoneNumber = "Phone Number is required";
    valid = false;
  } else if (!phoneRegex.test(newContact.phoneNumber)) {
    errors.phoneNumber =
      "Phone format is invalid. Please use that format: +1 (XXX) XXX-XXXX.";

    valid = false;
    console.log(valid, "=-");
  }
  return errors;
};
