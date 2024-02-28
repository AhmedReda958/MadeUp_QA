import App from "@/App.jsx";
import HomePage from "@/pages/HomePage";
import NotificationPage from "@/pages/NotificationPage";
import UserProfile from "@/pages/ProfilePage";
import ReplayMessagePage from "@/pages/ReplayMessagePage";
import SettingsPage from "@/pages/settings/SettingsPage";
import MessagesPage from "@/pages/messagesPage";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";
import PersonalInfoSettingsPage from "@/pages/settings/PersonalInfoSettingsPage";
import LoginPage from "@/pages/auth/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <div>User not found :|</div>,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
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
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings/info",
        element: (
          <ProtectedRoute>
            <PersonalInfoSettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
]);

export default router;
