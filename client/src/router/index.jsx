import App from "@/App.jsx";
import UserProfile from "@/pages/ProfilePage";
import ReplayMessagePage from "@/pages/ReplayMessagePage";
import MessagesPage from "@/pages/messagesPage";
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
      { path: "messages", element: <MessagesPage /> },
      { path: "messages/replay", element: <ReplayMessagePage /> },
    ],
  },
]);

export default router;
