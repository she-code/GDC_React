// export interface formData {
//   id: number;
//   title: string;
//   formFields: formField[];

// }
// export type formField = {
//   id: number;
//   label: string;
//   fieldType: textFieldTypes;
//   value: string;
// };
/****We can define our custom types using keyword type
 * types can be used to create alias
 * export type Name = string;
 */
export type formData = {
  id: number;
  title: string;
  formFields: formField[];
};

//unions
export type textFieldTypes =
  | "text"
  | "email"
  | "date"
  | "tel"
  | "password"
  | "radio"
  | "textarea"
  | "number"
  | "select";
/***descriminated unions */
export type TextField = {
  id: number;
  kind: "text";
  label: string;
  fieldType: textFieldTypes;
  value: string;
};
export type DropdownField = {
  id: number;
  kind: "dropdown";
  label: string;
  options: string[];
  value: string;
};

export type formField = TextField | DropdownField;
