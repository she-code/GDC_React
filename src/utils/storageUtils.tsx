import { formData } from "../types/formTypes";
import { responseData } from "../types/responseTypes";
export const getLocalForms: () => formData[] = () => {
  const savedFormsJson = localStorage.getItem("savedForms");
  return savedFormsJson ? JSON.parse(savedFormsJson) : [];
};

export const initialState: (id: number) => formData | undefined = (
  id: number
) => {
  const localForms = getLocalForms();
  const selectedForm = localForms?.find((form) => form.id === id);
  return selectedForm;
};

export const getLocalResponses: () => responseData[] = () => {
  const savedResponses = localStorage.getItem("savedResponses");
  return savedResponses ? JSON.parse(savedResponses) : [];
};
