import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import RouteLayout from "./layout/RouteLayout";
import RunModel from "./pages/RunModel"

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RouteLayout />}>
      <Route index element={<Home />} />
      <Route path="/run-model" element={<RunModel />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;