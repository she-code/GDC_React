import React, { useEffect, useState } from "react";
import Form from "./Form";

export default function FormsList(props: { closeFormsListCB: () => void }) {
  const [formsListState, setFormsList] = useState([]);
  const [form,setFormPage] = useState("formsList")
  const [formId,setFormId] = useState(0)
  useEffect(() => {
    const savedForms = localStorage.getItem("savedForms");
    const savedFormsJson = JSON.parse(savedForms!);
    setFormsList(savedFormsJson);
  }, []);
  const openForm = (id:any) =>{ setFormPage("Form");
  // <Form closeFormCB={closeForm} id={id}/>
  setFormId(id)
}
  const closeForm = () =>{setFormId(0);
  }

  return (
    <div>
      {
        formId === 0?
         (<>
         <button className="bg-indigo-500 py-2 px-3 text-white rounded-lg" onClick={(_)=>openForm(null)
         }>New Form</button>
          <div> {formsListState?.map((form: any) => (
            <div className="flex gap-2 justify-between my-2">
              <p>{form.title}</p>
              <button className="bg-blue-500  text-white py-2 px-3 rounded-lg" onClick={(_)=>openForm(form.id)}> 
                Edit
              </button>
              <button className="bg-green-500 text-white py-2 px-3 rounded-lg">
                Delete
              </button>
            </div>
          ))}</div>
         </>
        ):<Form closeFormCB={closeForm} id={formId}/>
        
      }
     
    </div>
  );
}
