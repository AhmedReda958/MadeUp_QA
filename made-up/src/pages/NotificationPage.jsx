import Page from "@/components/ui/Page";
import { useState, useCallback, useMemo, useEffect, Fragment } from "react";
import axios from "axios";
import sleepImg from "@/assets/imgs/sleep.svg";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

// assets
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

// utils
import useAlert from "@/utils/hooks/useAlert";
import { formatDate } from "@/utils/helpers";

// redux
import { useDispatch, useSelector } from "react-redux";
import { share } from "@/redux/slices/appSlice";
import { markAsSeen } from "@/redux/actions/notificationsActions";
import {
  fetchNotifications,
  refreshNotifications,
} from "@/redux/slices/contentSlice";

// ionic
import {
  useIonViewWillEnter,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";

// components
import { Dialog, Menu, Transition } from "@headlessui/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const EmptyPage = () => {
  return (
    <div>
      <img
        src={sleepImg}
        className="w-[200px] m-auto mt-20 opacity-70 "
        alt=""
        draggable="false"
        loading="lazy"
      />
      <div className="pt-12 ps-3 text m-auto w-80">
        <p className="text-center text-xl text-altcolor">
          There's no new Notification
        </p>
      </div>
    </div>
  );
};

const NotificationMenu = ({ data }) => {
  const Alert = useAlert();

  return (
    <Menu as="div" className="relative inline-block text-left w-6 h-6">
      <Menu.Button>
        <EllipsisVerticalIcon className="w-6 h-6" />
      </Menu.Button>
      <div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-30 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="p-1">
              <Menu.Item>
                <button
                  onClick={() =>
                    Alert({ title: "Coming soon!", type: "comingsoon" })
                  }
                  className="text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm"
                >
                  <i className="fa fa-trash text-red-500 pe-3"></i>
                  Delete
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
};

const NotificationItem = ({ data }) => {
  return (
    <div className="flex p-2 pt-3 mb-4 shadow rounded-md bg-altcolor text-maincolor">
      <div className="pe-2 w-12 h-12 flex items-center justify-center">
        <BellAlertIcon className={`w-8 h-8 ${!data.seen && "text-primary"}`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-altcolor text-md">{data?.title}</h3>
          <NotificationMenu data={data} />
        </div>
        <Link to={data?.url} as="p" className="text-sm truncate">
          {data?.content}
        </Link>
      </div>
    </div>
  );
};

const NotificationPage = () => {
  const { unseen } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.content.notifications);

  useEffect(() => {
    getNotifications();
    markNotificationsAsSeen();
  }, []);

  const markNotificationsAsSeen = () => {
    if (unseen.notifications > 0) {
      dispatch(markAsSeen({ type: "notifications" }));
    }
  };

  const getNotifications = () => {
    dispatch(fetchNotifications());
  };

  const handleRefresh = (e) => {
    setTimeout(() => {
      dispatch(refreshNotifications());
      dispatch(fetchNotifications());
      e.detail.complete();
    }, 500);
  };

  const notifications = useMemo(() => data, [data]);
  const isLoading = loading && notifications.length === 0;

  return (
    <Page title={"Notification"} backTo="/home">
      {/* // refresher */}
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      {/* content */}
      <div>
        {notifications.length > 0 ? (
          <div>
            {notifications.map((item) => {
              return <NotificationItem data={item} key={item._id} />;
            })}
          </div>
        ) : (
          <>
            {isLoading && <LoadingSpinner />}
            <EmptyPage />
          </>
        )}
      </div>

      {/* infinte scroll */}
      <IonInfiniteScroll
        onIonInfinite={(ev) => {
          if (notifications.length > 9) {
            // 10 is the limit
            ev.target.disabled = true;
            return;
          }
          getNotifications();
          setTimeout(() => ev.target.complete(), 500);
        }}
      >
        <IonInfiniteScrollContent></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </Page>
  );
};

export default NotificationPage;
