import {
  DropdownField,
  FormItem,
  RadioType,
  formData,
} from "../types/formTypes";
import { FormActions } from "../types/stateReducerTypes";
import { getNewField } from "../utils/newField";
import { getLocalResponses } from "../utils/storageUtils";
const responses = getLocalResponses();

//Action reducer
export const StateReducer = (
  state: FormItem | undefined,
  action: FormActions
) => {
  switch (action.type) {
    // case "add_field": {
    //   const newField = getNewField(action.fieldType, action.label);
    //   if (newField.label.length > 0 && state?.formFields) {
    //     action.callback();
    //     return {
    //       ...state,
    //       formFields: [...state.formFields, newField],
    //     };
    //   }
    //   return state;
    // }
    // case "remove_field": {
    //   responses.forEach((response) => {
    //     response.responses = response.responses?.filter(
    //       (r) => r.questionId !== action.id
    //     );
    //   });
    //   localStorage.setItem("savedResponses", JSON.stringify(responses));
    //   return {
    //     ...state,
    //     formFields: state?.formFields?.filter(
    //       (field) => field.id !== action.id
    //     ),
    //   };
    // }
    case "update_title": {
      return {
        ...state,
        title: action.title,
      };
    }
    // case "add_option": {
    //   return {
    //     ...state,
    //     formFields: state?.formFields?.map((field) => {
    //       if (field.id === action.fieldId && field.kind !== "text") {
    //         return {
    //           ...field,
    //           options: [
    //             ...((field as DropdownField | RadioType)?.options ?? []),
    //             action.option,
    //           ],
    //         };
    //       }
    //       return field;
    //     }),
    //   };
    // }
    // case "remove_option": {
    //   return {
    //     ...state,
    //     formFields: state?.formFields?.map((field) => {
    //       if (field.id === action.fieldId && field.kind !== "text") {
    //         return {
    //           ...field,
    //           options: (field as DropdownField | RadioType).options?.filter(
    //             (option: string, index: number) => index !== action.optionId
    //           ),
    //         };
    //       }
    //       return field;
    //     }),
    //   };
    // }
    // case "update_label": {
    //   return {
    //     ...state,
    //     formFields: state?.formFields?.map((field) => {
    //       if (field.id === action.id) {
    //         responses?.forEach((response) => {
    //           response.responses?.forEach((res) => {
    //             if (res.questionId === field?.id) {
    //               res.question = action.value;
    //               localStorage.setItem(
    //                 "savedResponses",
    //                 JSON.stringify(responses)
    //               );
    //             }
    //           });
    //         });
    //         return {
    //           ...field,
    //           label: action.value,
    //         };
    //       }
    //       return field;
    //     }),
    //   };
    // }
    // case "update_option": {
    //   return {
    //     ...state,
    //     formFields: state?.formFields?.map((field) => {
    //       if (field.id === action.fieldId && field.kind !== "text") {
    //         return {
    //           ...field,
    //           options: (field as DropdownField | RadioType).options?.map(
    //             (option: string, index: number) => {
    //               if (index === action.index) {
    //                 responses.forEach((response) => {
    //                   response.responses.forEach((res) => {
    //                     if (
    //                       res.response ===
    //                       (field as DropdownField | RadioType)?.options[index]
    //                     ) {
    //                       res.response = action.option;
    //                     }
    //                   });
    //                 });

    //                 return action.option;
    //               }
    //               return option;
    //             }
    //           ),
    //         };
    //       }
    //       return field;
    //     }),
    //   };
    // }
  }
};
