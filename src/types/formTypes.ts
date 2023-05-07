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

// export type FormItem = Omit<formData, "formFields">;

export type FormItem = {
  id?: number;
  title: string;
  description?: string;
  is_public?: boolean;
};

//generic type
export type Errors<T> = Partial<Record<keyof T, string>>;

export const validateForm = (form: FormItem) => {
  const { title } = form;
  const errors: Errors<FormItem> = {};
  if (title.length < 1) {
    errors.title = "Title is required";
  }
  if (title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }
  return errors;
};
export type FormFieldKind = "TEXT" | "DROPDOWN" | "RADIO" | "COLOR";
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
  | "color"
  | "select";
/***descriminated unions */
export type TextField = {
  id: number;
  kind: FormFieldKind;
  label: string;
  fieldType: textFieldTypes;
  value: string;
};
export type DropdownField = {
  id: number;
  kind: FormFieldKind;
  label: string;
  options: string[];
  value: string;
};
export type RadioType = {
  id: number;
  kind: FormFieldKind;
  label: string;
  value: string;
  options: string[];
};
export type ColorField = {
  id: number;
  kind: FormFieldKind;
  label: string;
  value: string;
  options: string[];
};
export type formField = TextField | DropdownField | RadioType | ColorField;
