export const validationRules = {
  firstName: { required: "Please enter your first name" },
  lastName: {
    required: "Please enter your last name",
    validate: (value: string) => typeof value === "string" || "Invalid input",
  },
  phoneNumber: {
    required: "Please enter your phone number",
    validate: (value: string) =>
      value.replace(/\D/g, "").length === 10
        ? true
        : "Phone Number must have 10 digits",
  },
  email: {
    required: "Please enter your email",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Invalid email address",
    },
  },
  position: { required: "Please choose a position" },
  company: { required: "Please enter your company or 'NA' if not applicable" },
};
