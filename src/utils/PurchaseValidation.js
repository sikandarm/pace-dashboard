export const validatePurchaseOrderForm = (formData) => {
  let valid = true;
  const errors = {};

  // Define regex patterns for validation
  const nameRegex = /^[a-zA-Z\s]+$/;
  const phoneRegex = /^\d{11}$/;
  const emailRegex = /\S+@\S+\.\S+/;
  const faxRegex = /^\+\d{1,3}-\d{1,3}-\d{3}-\d{4}$/;
  const numberRegex = /^-?\d+$/;

  // Helper function to check and trim a field
  const validateField = (field, regex, fieldName) => {
    if (!field) {
      errors[fieldName] = `${fieldName} is required`;
      valid = false;
    } else if (regex && !regex.test(String(field))) {
      errors[fieldName] = `${fieldName} is invalid`;
      valid = false;
    }
  };

  validateField(formData.company_id, null, "company_name");
  validateField(formData.delivery_date, null, "delivery_date");
  validateField(formData.vendor_id, null, "vendor_name");
  validateField(formData.userId, null, "userId");
  validateField(formData.order_date, null, "order_date");
  validateField(formData.po_number, numberRegex, "po_number");
  validateField(formData.phone, phoneRegex, "phone");
  validateField(formData.term, nameRegex, "term");
  validateField(formData.ship_via, nameRegex, "ship_via");
  validateField(formData.placed_via, nameRegex, "placed_via");
  validateField(formData.ship_to, nameRegex, "ship_to");
  validateField(formData.order_by, nameRegex, "order_by");
  validateField(formData.confirm_with, nameRegex, "confirm_with");
  validateField(formData.address, nameRegex, "address");
  validateField(formData.email, emailRegex, "email");
  validateField(formData.fax, faxRegex, "fax");

  // Add more validation rules for other fields as needed

  return { valid, errors };
};
