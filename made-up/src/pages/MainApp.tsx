import { useSelector, useDispatch } from "react-redux";
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
import { Redirect, Route } from "react-router";

// helpers
import {
  setStatusBarStyleDark,
  setStatusBarStyleLight,
} from "@/utils/native/statusbar";

// icons
import {
  HomeIcon,
  BellIcon,
  EnvelopeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

// pages
import HomePage from "@/pages/HomePage";
import NotificationPage from "@/pages/NotificationPage";
import UserProfile from "@/pages/ProfilePage";
import ReplayMessagePage from "@/pages/messages/ReplayMessagePage";
import SettingsPage from "@/pages/settings/SettingsPage";
import MessagesPage from "@/pages/messages/MessagesPage";
import { NotFoundPage } from "@/pages/ErrorHandle/NotFoundPage";
import OfflinePage from "@/pages/ErrorHandle/OfflinePage";
import ShowMessagePage from "@/pages/messages/ShowMessagePage.tsx";
import ProfilePicPage from "@/pages/settings/ProfilePicPage";
import PersonalInfoSettingsPage from "@/pages/settings/PersonalInfoSettingsPage";

function MainApp() {
  const { userToken, logedin, userInfo } = useSelector((state) => state.auth);
  const isDarkTheme = useSelector((state) => state.app.isDarkTheme);
  const dispatch = useDispatch();

  // automatically authenticate user if token is found
  const autoAuth =
    userToken &&
    useGetUserDetailsQuery("userDetails", {
      // perform a refetch every 15mins
      pollingInterval: 900000,
    });
  useEffect(() => {
    if (autoAuth?.data) {
      dispatch(setCredentials(autoAuth.data));
    }
  }, [autoAuth?.data, dispatch]);

  // check for internet connection
  useEffect(() => {
    checkInternetConnection();
  }, []);

  // dark theme
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    document.body.classList.toggle("dark", isDarkTheme);
    isDarkTheme ? setStatusBarStyleDark() : setStatusBarStyleLight();

    prefersDark.addEventListener("change", (e) => {
      document.body.classList.toggle("dark", e.matches);
      e.matches ? setStatusBarStyleDark() : setStatusBarStyleLight();
    });
  }, []);

  return (
    <div className="font-body min-h-screen min-w-screen  bg-light text-body-alt dark:bg-dark dark:text-secondary-alt">
      <main
        id="main-app"
        className="relative container w-full h-screen no-scrollbar max-w-[768px] mx-auto p-4 px-5 md-7 overflow-y-auto scroll-smooth"
      >
        <IonTabs>
          <IonRouterOutlet>
            <Redirect exact path="/" to="/home" />
            <Route path="/home" render={() => <HomePage />} />
            <Route
              path="/user/:username"
              exact
              render={() => <UserProfile />}
            />
            <Route
              path="/notifications"
              exact
              render={() => <NotificationPage />}
            />
            {/* messages */}
            <Route path="/messages" exact render={() => <MessagesPage />} />
            <Route path="/messages/replay/:id" exact>
              {({ match }) => <ReplayMessagePage match={match} />}
            </Route>
            <Route
              path="/messages/:id"
              render={({ match }) => <ShowMessagePage match={match} />}
              exact
            />

            {/* settings */}
            <Route path="/settings" exact>
              <SettingsPage />
            </Route>
            <Route
              path="/settings/info"
              component={PersonalInfoSettingsPage}
            ></Route>
            <Route
              path="/settings/profilePic"
              exact
              component={ProfilePicPage}
            ></Route>
          </IonRouterOutlet>

          {/* tool bar */}
          <IonTabBar slot="bottom" translucent>
            <IonTabButton tab="home" href="/home">
              <HomeIcon className="w-6 h-6" />
            </IonTabButton>
            <IonTabButton tab="notifications" href="/notifications">
              <BellIcon className="w-6 h-6" />
            </IonTabButton>
            <IonTabButton tab="messages" href="/messages">
              <EnvelopeIcon className="w-6 h-6" />
            </IonTabButton>
            <IonTabButton tab="profile" href={"/user/" + userInfo.username}>
              <UserIcon className="w-6 h-6" />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </main>
      <ShareDialog />
    </div>
  );
}

export default MainApp;
