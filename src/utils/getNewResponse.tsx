import { responseType } from "../types/responseTypes";

export const getNewResponse: (
  question: string,
  response: string | string[]
) => responseType = (question, response) => {
  return {
    question: question,
    questionId: Number(new Date()),
    response: response,
  };
};

//   }
//     ...responseState,
//     responses: responseState.responses?.map((res) => {
//       if (res.questionId === action.id) {
//         action.updateUserResCB();
//         if (
//           action.state.formFields[action.currentField]?.kind === "dropdown"
//         ) {
//           action.updateSelectedCB();
//         }

//         return responseState;
//       }
//       return {
//         ...responseState,
//         responses: [
//           ...responseState.responses,
//           {
//             question: action.label,
//             response: action.response,
//             questionId: action.id,
//           },
//         ],
//       };
//       // action.updateUserResCB();
//       // action.updateSelectedCB();
//     }),
//   };
// }
