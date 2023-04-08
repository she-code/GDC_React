import React from "react";
import Header from "./Components/Header";
import AppContainer from "./Components/AppContainer";
import InputField from "./Components/InputField";
import Button from "./Components/Button";
const formFields = [
  { id: 1, label: "First Name", type: "text" },
  { id: 2, label: "Last Name", type: "text" },
  { id: 3, label: "Email", type: "email" },
  { id: 4, label: "Date of Birth", type: "date" },
  { id: 5, label: "Phone Number", type: "tel" },
];
function App() {
  return (
    <AppContainer>
      <div className=" p-4 mx-auto bg-white shadow-lg rounded-xl w-5/12 px-5">
        <Header title="Welcome to lesson 5 of react-typescript with #tailwindcss" />
        {formFields.map((field) => (
          <InputField id={field.id} label={field.label} type={field.type} />
        ))}
        <Button name={"Submit"} />
      </div>
    </AppContainer>
  );
}

export default App;
