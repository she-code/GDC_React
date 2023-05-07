import { formField } from "../types/formTypes";

export const initialFormFields: formField[] = [
  { kind: "TEXT", id: 1, label: "First Name", fieldType: "text", value: "" },
  { kind: "TEXT", id: 2, label: "Last Name", fieldType: "text", value: "" },
  { kind: "TEXT", id: 3, label: "Email", fieldType: "email", value: "" },
  {
    kind: "DROPDOWN",
    id: 4,
    label: "Priority",
    options: ["High", "Low"],
    value: "",
  },
  {
    kind: "RADIO",
    id: 5,
    label: "Easy",
    options: ["Yes", "No"],
    value: "",
  },
  {
    kind: "COLOR",
    id: 6,
    label: "Choose color",
    options: ["red", "#ffff00", "rgb(45,67,247)"],
    value: "",
  },
];
