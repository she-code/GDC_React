import { FormItem } from "./formTypes";

export type FetchFormsSucess = {
    type: "FETCH_FORMS_SUCCESS";
    fomrs: FormItem;
}
export type FetchFormsError = {
    type: "FETCH_FORMS_FAILURE";
    error: string;}
export type  FormIntialState = {
    form:FormItem,
    loading :false
    error : Error|null
}
export type FormAction = FetchFormsSucess | FetchFormsError;
