import React, { useState } from "react";
import Form from "./Components/Form";
import AppContainer from "./Components/AppContainer";
import Header from "./Components/Header";
import Home from "./Components/Home";

function App() {
  const [state, setState] = useState("Home");
  const closeForm = () => setState("Home");
  const openForm = () => setState("Form");
  return (
    <AppContainer>
      <div className=" p-4 mx-auto bg-white shadow-lg rounded-xl w-1/2 px-5">
        <Header title="Welcome to lesson 5 of react-typescript with #tailwindcss" />
        {state === "Home" ? (
          <Home openFormCB={openForm} />
        ) : (
          <Form  closeFormCB={closeForm} />
        )}
      </div>
    </AppContainer>
  );
}

export default App;
