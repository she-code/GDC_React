import { PaginationParams } from "../types/common";
import { FormFieldType, FormItem } from "../types/formTypes";
import { Submission } from "../types/responseTypes";

const API_BASE_URL = "https://tsapi.coronasafe.live/api/";
type RequestMethod = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
export const request = async (
  endpoint: string,
  method: RequestMethod = "GET",
  data: any = {}
) => {
  let url;
  let payload: string;
  if (method === "GET") {
    const requestParams = data
      ? `?${Object.keys(data)
          .map((key) => `${key}=${data[key]}`)
          .join("&")}`
      : "";
    url = `${API_BASE_URL}${endpoint}${requestParams}`;
    payload = "";
  } else {
    url = `${API_BASE_URL}${endpoint}`;
    payload = data ? JSON.stringify(data) : "";
  }
  //Basic Authentication
  //  const auth = "Basic " + window.btoa("sheCode:fre123AB@");

  //Token Authentication
  const token = localStorage.getItem("token");
  const auth = token ? "Token " + localStorage.getItem("token") : "";
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },

      body: method !== "GET" ? payload : null,
    });
    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      const errorJson = await response.json();
      throw Error(errorJson);
    }
  } catch (error) {
    console.log(error);
  }
};

export const createForm = (form: FormItem) => {
  return request("forms/", "POST", form);
};
export const login = (username: string, password: string) => {
  return request("auth-token/", "POST", { username, password });
};
export const me = () => {
  return request("users/me", "GET", {});
};

export const listForms = (pageParams: PaginationParams) => {
  return request("forms/", "GET", pageParams);
};

// get form
export const getForm = (formId: number) => {
  return request(`forms/${formId}`, "GET", {});
};

//update form
export const updateForm = (formId: number, form: FormItem) => {
  return request(`forms/${formId}/`, "PATCH", form);
};
// delete form
export const deleteForm = (formId: number) => {
  return request(`forms/${formId}/`, "DELETE", {});
};
// create formFields
export const createFormFields = (formId: number, formField: FormFieldType) => {
  return request(`forms/${formId}/fields/`, "POST", formField);
};

//get formFields
export const getFormFields = (pageParams: PaginationParams, formId: number) => {
  return request(`forms/${formId}/fields/`, "GET", pageParams);
};
//update formFields
export const updateFormField = (
  formId: number,
  formFieldId: number,
  formField: FormFieldType
) => {
  return request(`forms/${formId}/fields/${formFieldId}/`, "PATCH", formField);
};
//delete formFields
export const deleteFormField = (formId: number, formFieldId: number) => {
  return request(`forms/${formId}/fields/${formFieldId}/`, "DELETE", {});
};

//get submissions
export const getSubmissions = (
  pageParams: PaginationParams,
  formId: number
) => {
  return request(`forms/${formId}/submission/`, "GET", pageParams);
};
//create submissions
export const createSubmission = (formId: number, submission: Submission) => {
  return request(`forms/${formId}/submission/`, "POST", submission);
};

//get submission
export const getSubmission = (formId: number, submissionId: number) => {
  return request(`forms/${formId}/submission/${submissionId}/`, "GET", {});
};
//add options
// export const addOptions = (
//   formId: number,
//   formFieldId: number,
//   option: string
// ) => {
//   return request(
//     `forms/${formId}/fields/${formFieldId}/`,
//     "PATCH",
//     option
//   );
// };
