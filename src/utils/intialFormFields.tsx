import { formField } from "../types/formTypes";

export const initialFormFields: formField[] = [
  { kind: "text", id: 1, label: "First Name", fieldType: "text", value: "" },
  { kind: "text", id: 2, label: "Last Name", fieldType: "text", value: "" },
  { kind: "text", id: 3, label: "Email", fieldType: "email", value: "" },
  {
    kind: "dropdown",
    id: 4,
    label: "Priority",
    options: ["High", "Low"],
    value: "",
  },
  {
    kind: "radio",
    id: 5,
    label: "Easy",
    options: ["Yes", "No"],
    value: "",
  },
  {
    kind: "color",
    id: 6,
    label: "Choose color",
    options: ["red", "#ffff00", "rgb(45,67,247)"],
    value: "",
  },
];
