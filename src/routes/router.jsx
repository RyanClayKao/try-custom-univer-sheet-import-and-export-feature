import { createBrowserRouter } from "react-router";
import Layout from "../Layout";
import SheetJSDemo from "../SheetJSDemo";
import Univer from "../Univer";
import EditorPage from "../pages/EditorPage";

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
      },
      {
        path: "editor",
        element: <EditorPage />,
      }
    ],
  }
]);

export default router;