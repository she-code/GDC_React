import { useRoutes } from "raviger";
import Home from "../Components/Home";
import About from "../Components/About";
import AppContainer from "../Components/AppContainer";
import Form from "../Components/Form";
import PreviewQuestion from "../Components/PreviewForm";
import { ToastContainer } from "react-toastify";
import NotFound from "../Components/NotFound";
import CreateForm from "../Components/CreateForm";
import Login from "../Components/Login";
import { User } from "../types/userTypes";

const routes = {
  "/": () => <Home />,

  "/about": () => <About />,
  "/forms/:formId": ({ formId }: { formId: string }) => (
    <Form id={Number(formId)} />
  ),
  "/createForm": () => <CreateForm />,
  "/login": () => <Login />,

  "/preview/:formId": ({ formId }: { formId: string }) => (
    <PreviewQuestion id={Number(formId)} />
  ),
  "*": () => <NotFound />,
};

export default function AppRouter(props: { currentUser: User }) {
  let routeResult = useRoutes(routes);
  return (
    <AppContainer currentUser={props.currentUser}>
      {routeResult}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AppContainer>
  );
}
