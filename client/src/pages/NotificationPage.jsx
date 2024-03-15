import Page from "@/components/ui/Page";
import { useState, useCallback, useMemo, useEffect, Fragment } from "react";
import axios from "axios";
import sleepImg from "@/assets/imgs/sleep.svg";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { formatDate } from "@/utils/helpers";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import useAlert from "@/utils/hooks/useAlert";
import { share } from "@/redux/slices/appSlice";
import { markAsSeen } from "@/redux/actions/notificationsActions";

const EmptyPage = () => {
  return (
    <div>
      <img
        src={sleepImg}
        className="w-[200px] m-auto mt-20 opacity-70 "
        alt=""
        draggable="false"
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
    <Link
      to={data?.url}
      className="flex p-2 pt-3 mb-4 shadow rounded-md bg-altcolor text-maincolor"
    >
      <div className="pe-2 w-12 h-12 flex items-center justify-center">
        <BellAlertIcon className={`w-8 h-8 ${!data.seen && "text-primary"}`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-altcolor text-md">{data?.title}</h3>
          <NotificationMenu data={data} />
        </div>
        <p className="text-sm truncate">{data?.content}</p>
      </div>
    </Link>
  );
};

const NotificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [notificationsData, setNotificationsData] = useState([]);
  const { unseen } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const getNotifications = useCallback(() => {
    setLoading(true);
    axios
      .get(`/notifications/inbox`, { params: { page: 1, limit: 10 } })
      .then((res) => {
        setNotificationsData(res.data);
      })
      .catch((err) => {
        console.error(err.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [notificationsData]);

  useEffect(() => {
    getNotifications();

    if (unseen.notifications > 0) {
      dispatch(markAsSeen({ type: "notifications" }));
    }
  }, []);

  const notifications = useMemo(() => notificationsData, [notificationsData]);

  return (
    <Page title={"Notification"} loading={loading}>
      {notifications.length > 0 ? (
        notifications.map((item) => {
          return <NotificationItem data={item} key={item._id} />;
        })
      ) : (
        <EmptyPage />
      )}
    </Page>
  );
};

export default NotificationPage;
