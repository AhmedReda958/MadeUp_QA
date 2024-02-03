import App from "@/App.jsx";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <div>home</div>,
      },
      { path: "profile", element: <div>profile</div> },
      { path: "notification", element: <div>notification</div> },
      { path: "messages", element: <div>messages</div> },
    ],
  },
]);

export default router;
