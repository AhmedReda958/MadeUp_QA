import { useEffect, useState } from "react";
import { checkInternetConnection } from "@/utils/handleConnection";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import { useGetUserDetailsQuery } from "@/redux/services/authServices";
import {
  fetchFeed,
  fetchNotifications,
  fetchMessages,
} from "@/redux/slices/contentSlice";
import { getNotificationsCount } from "@/redux/actions/notificationsActions";

//ionic
import {
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonViewWillEnter,
} from "@ionic/react";
import { Redirect, Route } from "react-router";

// helpers
import {
  setStatusBarStyleDark,
  setStatusBarStyleLight,
} from "@/utils/native/statusbar";
import sounds from "@/utils/assets/sounds";

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
import ReplyMessagePage from "@/pages/messages/ReplyMessagePage";
import SettingsPage from "@/pages/settings/SettingsPage";
import MessagesPage from "@/pages/messages/MessagesPage";
import { NotFoundPage } from "@/pages/ErrorHandle/NotFoundPage";
import OfflinePage from "@/pages/ErrorHandle/OfflinePage";
import ShowMessagePage from "@/pages/messages/ShowMessagePage";
import ProfilePicPage from "@/pages/settings/ProfilePicPage";
import PersonalInfoSettingsPage from "@/pages/settings/PersonalInfoSettingsPage";

function MainApp() {
  const { userToken, logedin, userInfo } = useSelector((state) => state.auth);
  const isDarkTheme = useSelector((state) => state.app.isDarkTheme);
  const dispatch = useDispatch();

  // notifications count
  const { unseen } = useSelector((state) => state.app);

  // check for notification count
  useEffect(() => {
    // todo: play sound only if the unseen count is greater than the previous count
    if ((unseen.notifications > 0) | (unseen.messages > 0))
      sounds.notification.play();
  }, [unseen]);

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

  // fetch data on app load
  useIonViewWillEnter(() => {
    dispatch(fetchFeed());
    dispatch(fetchNotifications());
    dispatch(fetchMessages());
  });

  return (
    <div className="font-body min-h-screen min-w-screen  bg-light text-body-alt dark:bg-dark dark:text-secondary-alt">
      <main
        id="main-app"
        className="relative container w-full h-screen no-scrollbar max-w-[768px] mx-auto p-4 px-5 md-7 overflow-y-auto scroll-smooth"
      >
        <IonTabs>
          <IonRouterOutlet>
            <Redirect exact path="/" to="/home" />
            <Route path="/home">
              <HomePage />
            </Route>
            <Route path="/user/:username" exact>
              {({ match }) => <UserProfile match={match} />}
            </Route>
            <Route path="/notifications" exact>
              <NotificationPage />
            </Route>
            {/* messages */}
            <Route path="/messages" exact>
              <MessagesPage />
            </Route>
            <Route path="/messages/anwser/:id" exact>
              {({ match, history }) => (
                <ReplyMessagePage match={match} history={history} />
              )}
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
              {unseen.notificaions > 0 && (
                <span className=" absolute top-2 right-6  rounded-full bg-primary w-4 h-4 text-xs text-white text-center">
                  {unseen.notifications}
                </span>
              )}
              <BellIcon className="w-6 h-6" />
            </IonTabButton>
            <IonTabButton tab="messages" href="/messages">
              {unseen.messages > 0 && (
                <span className=" absolute top-2 right-6 rounded-full bg-primary w-4 h-4 text-xs text-white text-center">
                  {unseen.messages}
                </span>
              )}
              <EnvelopeIcon className="w-6 h-6" />
            </IonTabButton>
            <IonTabButton tab="profile" href={"/user/" + userInfo.username}>
              <UserIcon className="w-6 h-6" />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </main>
    </div>
  );
}

export default MainApp;
