import ProfilePic from "@/components/ProfilePic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatDate } from "@/utils/helpers";
import useAxios from "@/utils/hooks/useAxios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Page from "@/components/ui/Page";
import { addAlert } from "@/redux/slices/appSlice";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

function ReplayMessagePage({ match, history }) {
  let [replayText, setReplayText] = useState("");
  let [replayLoading, setReplayLoading] = useState(false);

  const id = match.params.id;

  if (!id) history.push("/messages");

  const messageData = useAxios({ url: `/messages/message/${id}` });
  const message = messageData.response;

  // todo add validation
  const handleReplayChange = (e) => {
    e.target.style.height = "";
    e.target.style.height = e.target.scrollHeight + "px";
    setReplayText(e.target.value);
  };

  const dispatch = useDispatch();

  const onSuccess = () => {
    dispatch(
      addAlert({
        title: "Reply sent successfully",
        type: "success",
      })
    );
  };
  const onFailure = () => {
    dispatch(
      addAlert({
        title: "Error, Reply isn't sent",
        type: "error",
      })
    );
  };

  const sendReplay = () => {
    setReplayLoading(true);
    axios
      .post(`/messages/message/${message._id}`, {
        privately: false,
        content: replayText,
      })
      .then((res) => {
        onSuccess();
        navigate(-1);
      })
      .catch((err) => {
        console.log("error: " + err.code);
        onFailure();
      })
      .finally(() => {
        setReplayLoading(false);
      });
  };

  return (
    <Page title={"Replay"} loading={messageData.loading}>
      {!messageData.loading ? (
        <div className=" h-full">
          <div className="flex mb-8 post_after after:mt-8">
            {/* profile pic */}
            <Link
              to={message.sender && "/" + message.sender.username}
              className="me-4"
            >
              <ProfilePic
                data={message.sender}
                annoymous={!message.sender}
                className="w-14 h-14"
              />
            </Link>

            <div className=" w-full min-h-40">
              {/* header */}
              <div className="pb-2">
                <div className="flex items-baseline">
                  <div className="flex items-center">
                    <h5 className="text-altcolor font-semibold text-lg  truncate max-w-52 ">
                      {message.sender ? message.sender.fullName : "Anonymous"}
                    </h5>
                    {message.sender?.verified && (
                      <CheckBadgeIcon className="w-5 h-5 ms-[2px] text-alt" />
                    )}
                  </div>
                  {message.sender && (
                    <span className="ps-2 pt-1 text-sm w-1/4 truncate">
                      @{message.sender.username}
                    </span>
                  )}
                </div>

                <div className="text-[10px]">
                  {formatDate(message.timestamp)}
                </div>
              </div>
              {/* content */}
              <div
                className="p-2 text-altcolor font-body-play font-semibold"
                dir="rtl"
              >
                {message.content}
              </div>
            </div>
          </div>
          {/* replay */}
          <div className="flex">
            <div className="me-4 drop-shadow-2xl">
              <ProfilePic data={message.receiver} className="w-14 h-14" />
            </div>
            <div className="w-full">
              <div className="flex items-baseline pb-2">
                Replying to
                <span className="text-primary ps-2">
                  {message.sender ? `@${message.sender.username}` : "Anonymous"}
                </span>
              </div>
              <textarea
                type="text"
                dir="rtl"
                className="font-body-play resize-none overflow-hidden bg-inherit w-full border-none focus:ring-0 dark:placeholder-body-alt placeholder-body text-body dark:text-body-alt "
                onChange={handleReplayChange}
                placeholder="Type your replay"
              />
            </div>
          </div>

          {/*
           //todo: move this section to toolbar
           */}
          <div className="">
            <button
              className="drop-shadow-xl mt-10  float-end button-lg"
              onClick={() => sendReplay()}
              disabled={replayLoading || replayText.length < 6}
            >
              Replay
              <i class="ps-2 fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </Page>
  );
}

export default ReplayMessagePage;
