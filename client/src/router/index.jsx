import App from "@/App.jsx";
import HomePage from "@/pages/HomePage";
import NotificationPage from "@/pages/NotificationPage";
import UserProfile from "@/pages/ProfilePage";
import ReplayMessagePage from "@/pages/messages/ReplayMessagePage";
import SettingsPage from "@/pages/settings/SettingsPage";
import MessagesPage from "@/pages/messages/MessagesPage";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";
import PersonalInfoSettingsPage from "@/pages/settings/PersonalInfoSettingsPage";
import LoginPage from "@/pages/auth/LoginPage";
import { NotFoundPage } from "@/pages/ErrorHandle/NotFoundPage";
import OfflinePage from "@/pages/ErrorHandle/OfflinePage";
import ShowMessagePage from "@/pages/messages/ShowMessagePage";
import ProfilePicPage from "@/pages/settings/ProfilePicPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: import.meta.env.MODE === "production" && <OfflinePage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: "*", element: <NotFoundPage /> },
      {
        path: ":username",
        element: <UserProfile />,
      },
      {
        path: "notification",
        element: (
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "messages",
        element: (
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "messages/replay",
        element: (
          <ProtectedRoute>
            <ReplayMessagePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "message/:id",
        element: <ShowMessagePage />,
      },
      {
        path: "settings",
        children: [
          {
            index: true,
            element: <SettingsPage />,
          },
          {
            path: "info",
            element: <PersonalInfoSettingsPage />,
          },
          {
            path: "profilePic",
            element: <ProfilePicPage />,
          },
        ],
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
]);

export default router;
