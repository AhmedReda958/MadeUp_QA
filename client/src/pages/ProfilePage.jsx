// UserProfile.js

import useAxios from "@/utils/hooks/useAxios";
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import EmptyContentImg from "@/assets/imgs/taken.svg";
import notFoundImg from "@/assets/imgs/theSearch.svg";

import SendMessageFrom from "@/components/SendMessageFrom";
import ProfilePic from "@/components/ProfilePic";
import Page from "@/components/ui/Page";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import MessageItem from "@/components/MessageItem";
import { Button } from "flowbite-react";
import axios from "axios";
import { share } from "@/redux/slices/appSlice";
import useAlert from "@/utils/hooks/useAlert";
import { CameraIcon } from "@heroicons/react/24/solid";
import { Helmet } from "react-helmet";

const EmptyPage = () => {
  return (
    <div className=" relative">
      <img
        src={EmptyContentImg}
        alt=""
        draggable="false"
        className=" max-w-60 m-auto mt-6 opacity-70 "
        loading="lazy"
      />
      <div
        className=" absolute left-3 top-28 text-lg font-light  text-altcolor "
        style={{ transform: "rotate(-90deg) translateY(-72px)" }}
      >
        No content found
      </div>
    </div>
  );
};

const UserNotFound = () => {
  return (
    <>
      <Page.Header title={"Not found"} />
      <div>
        <img
          src={notFoundImg}
          alt="user is not found"
          draggable="false"
          className=" max-w-60 m-auto mt-16 "
        />
        <div className="pt-12 ps-3 text m-auto w-80">
          <p className="text-xl text-altcolor">This user is not exist</p>
          {/* <p className="pt-1 text-sm font-light">
            Try to use 
          </p> */}
          <div>
            <Button
              color="primary"
              size={"sm"}
              className="mt-5 float-end"
              as={Link}
              to={"/"}
            >
              Go Back
              <i className="fa fa-arrow-right ps-2"></i>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const ProfileMessages = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [messagesData, setMessagesData] = useState([]);
  const [error, setError] = useState();

  const getMessages = useCallback(
    () =>
      axios
        .get(`messages/user/${userId}`, {
          params: {
            page: 1,
            limit: 10,
          },
        })
        .then((res) => {
          setMessagesData(res.data);
        })
        .catch((err) => {
          console.error(err.message);
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        }),
    [userId]
  );
  // getMessages();
  useEffect(() => {
    getMessages();
  }, [userId]);

  const messages = useMemo(() => messagesData, [messagesData, userId]);

  return (
    <div>
      {!loading ? (
        error ? (
          error
        ) : messages.length > 0 ? (
          <>
            <div className="p-2 flex justify-between">
              <div className="text-altcolor font-simibold">
                Answers {messages.length}
                <div className="m-auto mt-1 w-6 h-[2px] bg-alt"></div>
              </div>
              <div>Likes 0</div>
              <div>Score 0</div>
            </div>
            {messages.map((message) => (
              <MessageItem key={message._id} message={message} />
            ))}
          </>
        ) : (
          <>
            <div className="p-2 flex justify-between">
              <div className="text-altcolor font-simibold">
                Answers 0<div className="m-auto mt-1 w-6 h-[2px] bg-alt"></div>
              </div>
              <div>Likes 0</div>
              <div>Score 0</div>
            </div>
            <EmptyPage />
          </>
        )
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

const UserProfile = () => {
  const username = useParams().username.toLowerCase();
  const { userInfo, logedin } = useSelector((state) => state.auth);

  const user = useAxios({ url: `/users?username=${username}` });
  const { response, error, loading } = user;

  const dispatch = useDispatch();
  const Alert = useAlert();

  return (
    <Page header={false}>
      {!loading ? (
        error ? (
          <UserNotFound />
        ) : (
          <>
            <Helmet>
              <title>{response.fullName} | MadeUp</title>
              <meta
                name="description"
                content={response.bio || `@${response.username} profile`}
              />
            </Helmet>
            <Page.Header title={"@" + response.username}>
              {userInfo.username != username ? (
                <div
                  className="p-3 text-lg cursor-pointer text-primary dark:text-white "
                  onClick={() =>
                    Alert({
                      title: "Coming soon!",
                      type: "comingsoon",
                    })
                  }
                >
                  <i className="fa fa-user-plus"></i>
                </div>
              ) : (
                <Link
                  to="/settings"
                  className="w-10 h-10 flex items-center justify-center rounded-full rounded-tr text-lg cursor-pointer text-white bg-primary"
                >
                  <i className="fa fa-gear"></i>
                </Link>
              )}
            </Page.Header>
            <div className="flex">
              <Link
                to={userInfo.username === username && "/settings/profilePic"}
                className="relative pointer"
              >
                <ProfilePic data={response} className="w-24 h-24" />
                {userInfo.username === username && (
                  <div>
                    <CameraIcon className="w-7 h-7 text-alt bg-dark dark:bg-dark-alt  rounded-full absolute bottom-1 right-0 p-1 cursor-pointer" />
                  </div>
                )}
              </Link>

              <div className="text-altcolor font-bold text-center grow flex items-center justify-around">
                <div>
                  <div>0</div> followers
                </div>
                <div>
                  <div>0</div> following
                </div>
              </div>
            </div>
            <div className="ps-2 mt-1">
              <h2 className="text-altcolor font-bold text-xl flex">
                {response.fullName || response.username}
                <span
                  style={{
                    marginTop: 5,
                    marginBlockStart: 5,
                    width: 22,
                    height: 22,
                    display: "flex",
                    background: "#6c63ff",
                    WebkitMaskSize: 22,
                    WebkitMaskPosition: "center",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskImage:
                      "url(https://onvo.me/media/svg/verify2.svg)",
                    marginLeft: 2,
                  }}
                />
              </h2>
              <p className="text-body dark:text-secondary-alt text-lg mt-1 mb-2">
                {response.bio}
              </p>
            </div>

            {userInfo.username != username ? (
              <SendMessageFrom userId={response._id} />
            ) : (
              <div className="mt-3 mb-2 flex justify-between gap-3 *:flex-1 *:font-bold ">
                {/* edit profile and share profile  buttons*/}
                <Button color="gray" size="sm" as={Link} to="/settings/info">
                  Edit Profile
                  <i className="fa fa-edit mx-1"></i>
                </Button>
                <Button
                  color="gray"
                  size="sm"
                  onClick={() =>
                    dispatch(
                      share({
                        url: window.location.origin + "/" + userInfo.username,
                      })
                    )
                  }
                >
                  Share Profile
                  <i className="fa fa-share-alt mx-2"></i>
                </Button>
              </div>
            )}

            <ProfileMessages userId={response._id} />
          </>
        )
      ) : (
        <LoadingSpinner />
      )}
    </Page>
  );
};

export default UserProfile;
