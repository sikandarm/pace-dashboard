export const validatePurchaseOrderForm = (formData) => {
  let valid = true;
  const errors = {};

  // Define regex patterns for validation
  const nameRegex = /^[a-zA-Z\s]+$/;
  const numberRegex = /^-?\d+$/;
  const emailRegex = /\S+@\S+\.\S+/;
  const usPhoneRegex = /^\+\d{1} \(\d{3}\) \d{3}-\d{4}$/; // Updated US phone regex
  const usFaxRegex = /^\+\d{1}-\d{3}-\d{3}-\d{4}$/; // Updated US fax regex

  // Helper function to check and trim a field
  const validateField = (field, regex, fieldName, errorMessage) => {
    if (!field) {
      // Skip validation if the field is empty and not required
      if (fieldName !== "fax") {
        errors[fieldName] = errorMessage || `${fieldName} is required`;
        valid = false;
      }
    } else if (regex && !regex.test(String(field))) {
      errors[fieldName] = errorMessage || `${fieldName} is invalid`;
      valid = false;
    }
  };

  // Validate fields with custom error messages
  validateField(
    formData.company_id,
    null,
    "company_name",
    "Company Name is required"
  );
  validateField(
    formData.delivery_date,
    null,
    "delivery_date",
    "Delivery Date is required!"
  );
  validateField(
    formData.vendor_id,
    null,
    "vendor_name",
    "Vendor Name is required"
  );
  // validateField(formData.userId, null, "userId", "Please assign a user");
  validateField(
    formData.order_date,
    null,
    "order_date",
    "Order Date is required"
  );
  validateField(
    formData.po_number,
    numberRegex,
    "po_number",
    "Invalid P0 Number Contain only Number"
  );
  validateField(
    formData.phone,
    usPhoneRegex,
    "phone",
    "Phone format is invalid. Please use the format: +1 (XXX) XXX-XXXX"
  );
  validateField(formData.term, null, "term", "Term is required");
  validateField(formData.ship_via, null, "ship_via", "Ship Via is required");
  validateField(
    formData.placed_via,
    null,
    "placed_via",
    "Placed Via is required"
  );
  validateField(formData.ship_to, null, "ship_to", "Ship To is required");
  validateField(
    formData.order_by,
    nameRegex,
    "order_by",
    "Invalid Order By Contain only Alphabet"
  );
  validateField(
    formData.confirm_with,
    nameRegex,
    "confirm_with",
    "Invalid Confirm With Contain only Alphabet"
  );
  validateField(formData.address, nameRegex, "address", "Address is required");
  validateField(formData.email, emailRegex, "email", "Email is required");
  validateField(
    formData.fax,
    usFaxRegex,
    "fax",
    "Fax format is invalid. Please use the format: +1-XXX-XXX-XXXX"
  );

  // Add more validation rules for other fields as needed

  return { valid, errors };
};
