export const validateCompanyForm = (formData) => {
  let valid = true;
  const errors = {};
  // console.log(")(()(",formData)
  const nameRegex = /^[a-zA-Z\s]+$/;
  // const phoneRegex = /^\+\d{1,2}\s\(\d{3}\)\s\d{3}-\d{4}$/;
  const phoneRegex = /^\d{10}$/;
  const faxRegex = /^\+\d{1,2}-\d{3}-\d{3}-\d{4}$/;

  if (formData.name.trim() === "") {
    errors.name = "name is required";
    valid = false;
  } else if (!nameRegex.test(formData.name.trim())) {
    errors.name = "name is invalid";
    valid = false;
  }

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email is invalid";
  }
  if (formData.address.trim() === "") {
    errors.address = "address is required";
    valid = false;
  } else if (!nameRegex.test(formData.address.trim())) {
    errors.address = "address is invalid";
    valid = false;
  }
  if (!formData.phone) {
    errors.phone = "Phone Number is required";
    valid = false;
  } else if (!phoneRegex.test(formData.phone)) {
    errors.phone =
      "Phone number must be exactly 10 digits without country code:";
    valid = false;
    console.log(valid, "=-");
  }
  if (formData.fax.trim() === "") {
    // errors.fax = "fax is required";
    valid = true;
  } else if (!phoneRegex.test(formData.fax.trim())) {
    errors.fax = "Fax number must be exactly 10 digits without country code:";
    valid = false;
    console.log(valid);
  }
  return errors;
};
