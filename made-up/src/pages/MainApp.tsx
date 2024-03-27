import { useSelector, useDispatch } from "react-redux";
import Toolbar from "@/components/Toolbar";
import { useGetUserDetailsQuery } from "@/redux/services/authServices";
import { useEffect, useState } from "react";
import { setCredentials } from "@/redux/slices/authSlice";
import { checkInternetConnection } from "@/utils/handleConnection";
import ShareDialog from "@/components/ui/ShareDialog";
import {
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Route } from "react-router";

// pages
import HomePage from "@/pages/HomePage";

import NotificationPage from "@/pages/NotificationPage";
import UserProfile from "@/pages/ProfilePage";
import ReplayMessagePage from "@/pages/messages/ReplayMessagePage";
import SettingsPage from "@/pages/settings/SettingsPage";
import MessagesPage from "@/pages/messages/MessagesPage";
import { IonReactRouter } from "@ionic/react-router";

function MainApp() {
  const [selectedTab, setSelectedTab] = useState("home");
  const app = useSelector((state) => state.app);
  const { userToken, logedin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // automatically authenticate user if token is found
  const autoAuth =
    userToken &&
    useGetUserDetailsQuery("userDetails", {
      // perform a refetch every 15mins
      pollingInterval: 900000,
    });
  // const { data, isFetching } = autoAuth;

  useEffect(() => {
    if (autoAuth?.data) {
      dispatch(setCredentials(autoAuth.data));
      // login to OneSignal
      //   OneSignalDeferred.push(function () {
      //     OneSignal.login(autoAuth.data._id);
      //   });
    }
  }, [autoAuth?.data, dispatch]);

  useEffect(() => {
    checkInternetConnection();
  }, []);

  return (
    <IonPage className={app.isDarkTheme ? "dark" : "light"}>
      <div className="font-body min-h-screen min-w-screen  bg-light text-body-alt dark:bg-dark dark:text-secondary-alt">
        <main
          id="main-app"
          className="relative container w-full h-screen no-scrollbar max-w-[768px] mx-auto p-4 px-5 md-7 overflow-y-auto scroll-smooth"
        >
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route path="/" render={() => <HomePage />} exact={true} />
                <Route
                  path="/notifications"
                  render={() => <NotificationPage />}
                  exact={true}
                />
                <Route
                  path="/messages"
                  render={() => <MessagesPage />}
                  exact={true}
                />
                <Route
                  path=":username"
                  render={() => <UserProfile />}
                  exact={true}
                />
              </IonRouterOutlet>
              {/* toolbar */}
              <IonTabBar
                slot="bottom"
                mode="ios"
                // color={app.isDarkTheme ? "light" : "dark"}
                translucent={true}
                selectedTab={selectedTab}
              >
                <IonTabButton
                  tab="home"
                  href="/"
                  selected={selectedTab === "home"}
                  onClick={() => setSelectedTab("home")}
                >
                  home
                </IonTabButton>
                <IonTabButton
                  tab="notifications"
                  href="/notifications"
                  selected={selectedTab === "notifications"}
                  onClick={() => setSelectedTab("notifications")}
                >
                  notifications
                </IonTabButton>
                <IonTabButton
                  tab="messages"
                  href="/messages"
                  selected={selectedTab === "messages"}
                  onClick={() => setSelectedTab("messages")}
                >
                  messages
                </IonTabButton>
                <IonTabButton
                  tab="profile"
                  href="/profile"
                  selected={selectedTab === "profile"}
                  onClick={() => setSelectedTab("profile")}
                >
                  profile
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        </main>
        <ShareDialog />
      </div>
    </IonPage>
  );
}

export default MainApp;
