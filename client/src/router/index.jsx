import App from "@/App.jsx";
import UserProfile from "@/pages/profile";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <div>User not found :|</div>,
    children: [
      {
        index: true,
        element: <div>home</div>,
      },
      {
        path: ":username",
        element: <UserProfile />,
      },
      { path: "notification", element: <div>notification</div> },
      { path: "messages", element: <div>messages</div> },
    ],
  },
]);

export default router;
