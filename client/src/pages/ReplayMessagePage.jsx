import ProfilePic from "@/components/ProfilePic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatDate } from "@/utils/helpers";
import useAxios from "@/utils/hooks/useAxios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Page from "@/components/ui/Page";

function ReplayMessagePage() {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  let [replayText, setReplayText] = useState("");
  let [replayLoading, setReplayLoading] = useState(false);

  // todo:hide query from user browser
  const id = searchParams.get("id");

  if (!id) navigate("/messages");

  const messageData = useAxios({
    url: `/messages/message/${id}`,
    headers: {
      params: {
        include: ["content", "timestamp"],
        user: ["sender", "receiver"],
      },
    },
  });
  const message = messageData.response;

  // todo add validation
  const handleReplayChange = (e) => {
    e.target.style.height = "";
    e.target.style.height = e.target.scrollHeight + "px";
    setReplayText(e.target.value);
  };

  // todo addd error handler
  const sendReplay = () => {
    setReplayLoading(true);
    axios
      .post(`/messages/message/${message._id}`, {
        privately: false,
        content: replayText,
      })
      .then((res) => {
        alert("replay sent");
        navigate(-1);
      })
      .catch((err) => {
        alert("error: " + err.code);
      })
      .finally(() => {
        setReplayLoading(false);
      });
  };

  return (
    <Page title={"Replay"} loading={messageData.loading}>
      {!messageData.loading ? (
        <div className="px-4">
          <div className="flex mb-8 post_after after:mt-8">
            {/* profile pic */}
            <Link
              to={message.sender && "/" + message.sender.username}
              className="me-4"
            >
              <ProfilePic data={message} className="w-14 h-14" />
            </Link>

            <div className=" w-full min-h-40">
              {/* header */}
              <div className="flex justify-between items-center pb-2">
                <div className="flex items-baseline">
                  <h5 className="text-altcolor font-semibold text-xl">
                    {message.sender ? message.sender.fullName : "Anonymous"}
                  </h5>
                  {message.sender && (
                    <span className="ps-2 pt-1 text-sm">
                      @{message.sender.username}
                    </span>
                  )}
                </div>

                <div className="text-[10px] float-end">
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
            <div className="me-4">
              <ProfilePic data={message} className="w-14 h-14" />
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
                className="font-body-play resize-none overflow-hidden bg-inherit w-full focus:outline-none dark:placeholder-body-alt placeholder-body text-body dark:text-body-alt"
                onChange={handleReplayChange}
                placeholder="Type your replay"
              />
            </div>
          </div>

          {/*
           //todo: move this section to toolbar
           */}
          <div>
            <button
              className="mt-10 ps-4 pe-4 py-2 rounded-xl rounded-br-3xl float-end  bg-primary text-white "
              onClick={() => sendReplay()}
              disabled={replayLoading}
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
