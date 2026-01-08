import { createBrowserRouter } from "react-router";
import Layout from "../Layout";
import SheetJSDemo from "../SheetJSDemo";
import Univer from "../Univer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <SheetJSDemo />,
      },
      {
        path: "univer",
        element: <Univer />,
      }
    ],
  }
]);

export default router;