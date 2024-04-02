import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import ProfilePic from "@/components/ProfilePic";
import Page from "@/components/ui/Page";
import SearchBar from "@/components/SearchBar";
import MessageItem from "@/components/MessageItem";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SettingsModal from "@/components/SettingsModal";
import postsImg from "@/assets/imgs/onlinefriends.svg";
import { share } from "@/redux/slices/appSlice";
import { fetchFeed } from "@/redux/slices/contentSlice";

// ionic
import {
  useIonViewDidEnter,
  useIonLoading,
  useIonViewWillEnter,
} from "@ionic/react";

const HomePage = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const auth = useSelector((state) => state.auth);

  // const [present, dismiss] = useIonLoading();

  // useIonViewWillEnter(() => {
  //   present({
  //     message: "Loading...",
  //     duration: 500,
  //   });
  // });

  // useIonViewDidEnter(() => {
  //   dismiss();
  // });

  return (
    <>
      {/* header */}
      <Page header={false}>
        <Page.Header title="Discovery">
          <div className="flex">
            <button
              className="text-altcolor"
              onClick={() => setOpenSettings(true)}
            >
              <AdjustmentsHorizontalIcon className="w-7 h-7" />
            </button>
            {auth.logedin && (
              <Link
                to={`/user/${auth.userInfo.username}`}
                className="ps-4 drop-shadow-xl"
              >
                <ProfilePic
                  data={auth.userInfo}
                  className="h-10 w-10"
                  border={false}
                />
              </Link>
            )}
          </div>
        </Page.Header>
        <SettingsModal
          opened={openSettings}
          close={() => setOpenSettings(false)}
        />
        <div className="my-6">
          <SearchBar />
        </div>
        <Feed />
        <button
          className="text-2xl button-lg fixed right-10 bottom-28 z-10 hidden"
          onClick={() => setOpenSettings(true)}
        >
          <i className="fa fa-bars"></i>
        </button>
      </Page>
    </>
  );
};

const Feed = () => {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = () => {};

  useIonViewDidEnter(() => {
    dispatch(fetchFeed());
  });

  const { data, loading } = useSelector((state) => state.content.feed);
  const messages = data;
  const isLoading = messages.length === 0 && loading;

  return (
    <div>
      {!isLoading ? (
        messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <MessageItem key={message._id} message={message} type="post" />
            ))}
          </>
        ) : (
          <div>
            <img
              src={postsImg}
              className="w-[270px] m-auto mt-20 opacity-90 "
              alt=""
              draggable="false"
            />
            <div className="pt-12 ps-3 text m-auto w-80">
              <p className="text-center">
                You don't have any users you follow, to show messages in your
                timeline follow some friends to see their answers or
              </p>
            </div>
            <div className="flex justify-center">
              <span
                className="text-primary underline text-center w-full"
                onClick={() => {
                  auth.logedin
                    ? dispatch(
                        share({
                          url:
                            window.location.origin +
                            "/" +
                            auth.userInfo.username,
                        })
                      )
                    : navigate("/login");
                }}
              >
                Share your Account
              </span>
            </div>
          </div>
        )
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};
export default HomePage;
