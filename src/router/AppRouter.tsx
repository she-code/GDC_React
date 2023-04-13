import { useRoutes } from "raviger";
import Home from "../Components/Home";
import About from "../Components/About";
import AppContainer from "../Components/AppContainer";
import Form from "../Components/Form";

const routes = {
  "/": () => <Home />,
  "/about": () => <About />,
  "/forms/:formId": ({ formId }: { formId: string }) => (
    <Form id={Number(formId)} />
  ),
};

export default function AppRouter() {
  let routeResult = useRoutes(routes);
  return <AppContainer>{routeResult}</AppContainer>;
}
