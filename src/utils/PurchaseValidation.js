export const validatePurchaseOrderForm = (formData) => {
  let valid = true;
  const errors = {};

  // Define regex patterns for validation
  const nameRegex = /^[a-zA-Z\s]+$/;
  const phoneRegex = /^\d{11}$/;
  const emailRegex = /\S+@\S+\.\S+/;
  const faxRegex = /^\+\d{1,3}-\d{1,3}-\d{3}-\d{4}$/;
  const numberRegex = /^-?\d+$/;

  if (formData.company_name.trim() === "") {
    errors.company_name = "company_name is required";
    valid = false;
  } else if (!nameRegex.test(formData.company_name.trim())) {
    errors.company_name = "company_name is invalid";
    valid = false;
  }

  if (!formData.delivery_date) {
    errors.delivery_date = "Delivery Date is required";
    valid = false;
  }

  if (formData.vendor_name.trim() === "") {
    errors.vendor_name = "vendor_name is required";
    valid = false;
  } else if (!nameRegex.test(formData.vendor_name.trim())) {
    errors.vendor_name = "vendor_name is invalid";
    valid = false;
  }

  if (!formData.order_date) {
    errors.order_date = "Order Date is required";
    valid = false;
  }

  if (!formData.po_number) {
    errors.po_number = "po_number is required";
    valid = false;
  } else if (!numberRegex.test(formData.po_number)) {
    errors.po_number = "po_number is invalid";
    valid = false;
  }

  if (!formData.phone) {
    errors.phone = "phone is required";
    valid = false;
  } else if (!phoneRegex.test(formData.phone)) {
    errors.phone = "phone is invalid";
    valid = false;
  }

  if (formData.term.trim() === "") {
    errors.term = "term is required";
    valid = false;
  } else if (!nameRegex.test(formData.term.trim())) {
    errors.term = "term is invalid";
    valid = false;
  }

  if (formData.ship_via.trim() === "") {
    errors.ship_via = "ship_via is required";
    valid = false;
  } else if (!nameRegex.test(formData.ship_via.trim())) {
    errors.ship_via = "ship_via is invalid";
    valid = false;
  }

  if (formData.placed_via.trim() === "") {
    errors.placed_via = "placed_via is required";
    valid = false;
  } else if (!nameRegex.test(formData.placed_via.trim())) {
    errors.placed_via = "placed_via is invalid";
    valid = false;
  }

  if (formData.ship_to.trim() === "") {
    errors.ship_to = "ship_to is required";
    valid = false;
  } else if (!nameRegex.test(formData.ship_to.trim())) {
    errors.ship_to = "ship_to is invalid";
    valid = false;
  }

  if (formData.order_by.trim() === "") {
    errors.order_by = "order_by is required";
    valid = false;
  } else if (!nameRegex.test(formData.order_by.trim())) {
    errors.order_by = "order_by is invalid";
    valid = false;
  }
  if (formData.confirm_with.trim() === "") {
    errors.confirm_with = "confirm_with is required";
    valid = false;
  } else if (!nameRegex.test(formData.confirm_with.trim())) {
    errors.confirm_with = "confirm_with is invalid";
    valid = false;
  }
  if (formData.address.trim() === "") {
    errors.address = "address is required";
    valid = false;
  } else if (!nameRegex.test(formData.address.trim())) {
    errors.address = "address is invalid";
    valid = false;
  }

  if (formData.email.trim() === "") {
    errors.email = "email is required";
    valid = false;
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = "email is invalid";
    valid = false;
  }
  if (formData.fax.trim() === "") {
    errors.fax = "fax is required";
    valid = false;
  } else if (!faxRegex.test(formData.fax.trim())) {
    errors.fax = "fax is invalid";
    valid = false;
  }

  // Add more validation rules for other fields as needed

  return { valid, errors };
};
