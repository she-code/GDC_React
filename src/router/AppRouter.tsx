import { useRoutes } from "raviger";

import Home from "../Components/Home";
import About from "../Components/About";
import AppContainer from "../Components/AppContainer";
import Form from "../Components/Form/Form";
import PreviewQuestion from "../Components/Preview/PreviewForm";
import { ToastContainer } from "react-toastify";
import NotFound from "../Components/NotFound";
import Login from "../Components/Login";
import { User } from "../types/userTypes";
import SubmissionDetail from "../Components/Submission/SubmissionDetail";
import SubmissionsList from "../Components/Submission/SubmissionsList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function AppRouter(props: { currentUser: User }) {
  const routes = {
    "/": () => <Home />,

    "/about": () => <About />,
    "/forms/:formId": ({ formId }: { formId: string }) => (
      <Form id={Number(formId)} />
    ),
    "/login": () => <Login />,

    "/preview/:formId": ({ formId }: { formId: string }) => (
      <PreviewQuestion id={Number(formId)} />
    ),
    "/forms/:id/submission/:submissionId": ({
      submissionId,
      id,
    }: {
      submissionId: string;
      id: string;
    }) => (
      <SubmissionDetail id={Number(id)} submissionId={Number(submissionId)} />
    ),
    "/forms/:formId/submission": ({ formId }: { formId: string }) => (
      <SubmissionsList formId={Number(formId)} />
    ),
    "*": () => <NotFound />,
  };
  let routeResult = useRoutes(routes);

  return (
    <DndProvider backend={HTML5Backend}>
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
    </DndProvider>
  );
}
