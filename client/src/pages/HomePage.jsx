import ProfilePic from "@/components/ProfilePic";
import Page from "@/components/ui/Page";
import { share } from "@/redux/slices/appSlice";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import postsImg from "@/assets/imgs/onlinefriends.svg";
import SearchBar from "@/components/SearchBar";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import MessageItem from "@/components/MessageItem";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SettingsModal from "@/components/SettingsModal";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [feedData, setFeedData] = useState({});

  const { unseen } = useSelector((state) => state.app);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getPosts = useCallback(() => {
    setLoading(true);
    axios
      .get(`/feed`, {
        params: {
          page: 1,
          limit: 10,
          user: ["sender", "receiver"],
          include: [
            "content",
            "sender",
            "receiver",
            "reply.content",
            "reply.timestamp",
            "timestamp",
          ],
        },
      })
      .then((res) => {
        setFeedData(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [feedData]);

  useEffect(() => {
    getPosts();
  }, []);

  const messages = useMemo(() => feedData, [feedData]);

  return (
    <div>
      {!loading ? (
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
                timeline follow some frinds to see their answers or
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

function HomePage() {
  const [openSettigs, setOpenSettings] = useState(false);
  const auth = useSelector((state) => state.auth);

  return (
    <>
      {/* header */}
      <Page header={false}>
        <Page.Header title="Discovery">
          <div className="flex ">
            <button
              className="text-altcolor"
              onClick={() => setOpenSettings(true)}
            >
              <AdjustmentsHorizontalIcon className="w-7 h-7" />
            </button>
            {auth.logedin && (
              <Link
                to={`/${auth.userInfo.username}`}
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
          opened={openSettigs}
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
}

export default HomePage;
