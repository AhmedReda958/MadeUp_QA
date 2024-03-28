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
import { Redirect, Route } from "react-router";

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
import ShowMessagePage from "@/pages/messages/ShowMessagePage";
import ProfilePicPage from "@/pages/settings/ProfilePicPage";
import PersonalInfoSettingsPage from "@/pages/settings/PersonalInfoSettingsPage";

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
    <div className={app.isDarkTheme ? "dark" : "light"}>
      <div className="font-body min-h-screen min-w-screen  bg-light text-body-alt dark:bg-dark dark:text-secondary-alt">
        <main
          id="main-app"
          className="relative container w-full h-screen no-scrollbar max-w-[768px] mx-auto p-4 px-5 md-7 overflow-y-auto scroll-smooth"
        >
          <IonTabs>
            <IonRouterOutlet>
              <Redirect exact path="/" to="/home" />
              <Route path="/home" exact render={() => <HomePage />} />
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
              <Route path="/messages" exact render={() => <MessagesPage />} />

              <Route
                path="/messages/replay/:id"
                component={ReplayMessagePage}
              />
              <Route path="/settings" exact component={SettingsPage} />

              <Route path="/message/:id" component={ShowMessagePage} />
              <Route
                path="/settings/profilePic"
                component={ProfilePicPage}
                exact
              />
              <Route
                path="/settings/info"
                component={PersonalInfoSettingsPage}
                exact
              />
            </IonRouterOutlet>
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
              <IonTabButton tab="profile" href="/user/:username">
                <UserIcon className="w-6 h-6" />
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </main>
        <ShareDialog />
      </div>
    </div>
  );
}

export default MainApp;
