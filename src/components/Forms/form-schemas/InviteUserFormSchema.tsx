import * as yup from "yup";
import { FormSchema, FormField } from "../FormPreview";
import { PLACEHOLDER_STANDARDS } from "../../../utils/formPlaceholderStandards";

export const inviteUserFormSchema: FormSchema = {
  formId: "invite-user-form",
  formTitle: " ",
  formDescription: "",
  multiStep: false,
  allowSaveAndContinue: false,
  autoSaveInterval: 0,
  submitEndpoint: "/api/invite-user",
  groups: [
    {
      groupTitle: "",
      groupDescription: "",
      fields: [
        {
          id: "firstName",
          label: "First Name",
          type: "text",
          required: true,
          placeholder: PLACEHOLDER_STANDARDS.firstName.placeholder,
          helperText: "Enter user's first name",
          validation: {
            minLength: 2,
            maxLength: 50,
            pattern: "^[a-zA-Z\\s\\-'\\.]+$",
            message: "Name can only contain letters, spaces, hyphens, apostrophes, and periods",
          },
        } as FormField,
        {
          id: "lastName",
          label: "Last Name",
          type: "text",
          required: true,
          placeholder: PLACEHOLDER_STANDARDS.lastName.placeholder,
          helperText: "Enter user's last name",
          validation: {
            minLength: 2,
            maxLength: 50,
            pattern: "^[a-zA-Z\\s\\-'\\.]+$",
            message: "Name can only contain letters, spaces, hyphens, apostrophes, and periods",
          },
        } as FormField,
        {
          id: "email",
          label: "Email",
          type: "email",
          required: true,
          placeholder: PLACEHOLDER_STANDARDS.email.placeholder,
          helperText: PLACEHOLDER_STANDARDS.email.helperText,
          validation: {
            maxLength: 254,
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message: "Invalid email address",
          },
        } as FormField,
        {
          id: "phoneNumber",
          label: "Phone Number",
          type: "tel",
          required: true,
          placeholder: PLACEHOLDER_STANDARDS.phoneNumber.placeholder,
          helperText: PLACEHOLDER_STANDARDS.phoneNumber.helperText,
          validation: {
            pattern: "^\\+?[1-9]\\d{1,14}$",
            message: "Please enter a valid phone number (E.164 format)",
          },
        } as FormField,
        {
          id: "role",
          label: "Role",
          type: "select",
          required: true,
          placeholder: "Select a role for the user",
          helperText: "Choose the appropriate role for this user",
          options: [
            { value: "admin", label: "Admin" },
            { value: "contributor", label: "Contributor" },
            { value: "creator", label: "Creator" },
            { value: "approver", label: "Approver" },
            { value: "viewer", label: "Viewer" },
          ],
        } as FormField,
      ],
    },
  ],
};

// Validation schema for the Invite User form
export const inviteUserFormValidationSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods"),
  email: yup
    .string()
    .required("Email address is required")
    .max(254, "Email address must not exceed 254 characters")
    .email("Please enter a valid email address")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address format"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (E.164 format)"),
  role: yup
    .string()
    .required("Role is required")
    .oneOf(["admin", "editor", "viewer", "advisor"], "Please select a valid role"),
});
