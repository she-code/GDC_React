import { textFieldTypes } from "./formTypes";

export type RemoveAction = {
  type: "remove_field";
  id: number;
};

export type AddAction = {
  type: "add_field";
  label: string;
  kind: string;
  fieldType: textFieldTypes;
  callback: () => void;
};
export type UpdateTitleAction = {
  type: "update_title";
  title: string;
};
export type AddOption = {
  type: "add_option";
  fieldId: number;
  option: string;
};
export type RemoveOption = {
  type: "remove_option";
  fieldId: number;
  optionId: number;
};
export type UpdateLabel = {
  type: "update_label";
  value: string;
  id: number;
};
export type UpdateOption = {
  type: "update_option";
  fieldId: number;
  index: number;
  option: string;
};
export type FormActions =
  | RemoveAction
  | AddAction
  | AddOption
  | RemoveOption
  | UpdateLabel
  | UpdateTitleAction
  | UpdateOption;
