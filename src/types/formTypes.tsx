// export interface formData {
//   id: number;
//   title: string;
//   formFields: formField[];
// }
export type formField = {
  id: number;
  label: string;
  fieldType: string;
  value: string;
};
/****We can define our custom types using keyword type
 * types can be used to create alias
 * export type Name = string;
 */
export type formData = {
  id: number;
  title: string;
  formFields: formField[];
};
