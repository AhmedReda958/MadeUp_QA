import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfilePic from "./ProfilePic";
import { formatDate } from "@/utils/helpers";

const MessageItem = ({ message, type = "post" }) => {
  const navigate = useNavigate();

  const navigateToReplayPage = () => {
    type === "message" && navigate("replay?id=" + message._id);
  };
  return (
    <div onClick={navigateToReplayPage} className="pt-5">
      {/* message */}
      <div
        className={`flex mb-8 ${type === "post" && "post_after after:ms-8"}`}
      >
        {/* profile pic */}
        <div className="me-2">
          <ProfilePic data={message.sender} className="w-14 h-14" />
        </div>

        <div className="bg-altcolor w-full  px-4 rounded-2xl shadow-md ">
          {/* header */}
          <div className="flex justify-between pt-3 pb-1">
            <div className="flex">
              <h5 className="text-altcolor font-semibold">
                {" "}
                {message.sender ? message.sender.fullName : "Anonymous"}
              </h5>
              {message.sender && (
                <span className="ps-1 pt-1 text-sm">
                  @{message.sender.username}
                </span>
              )}
            </div>
            <div>
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
          </div>
          {/* content */}
          <div
            className="p-2 text-altcolor font-semibold font-body-play"
            dir="rtl"
          >
            {message.content}
          </div>
          <div className="pt-2 pb-3 flex justify-between items-center">
            <div className="text-xs">{formatDate(message.timestamp)}</div>
            {type == "message" && (
              <Link to={"replay?id=" + message._id} className="button-lg ">
                Replay
                <i class="fa fa-share ps-2 "></i>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* replay */}
      {type === "post" && (
        <div className="flex">
          <div className="me-4 drop-shadow-2xl">
            <ProfilePic data={message.receiver} className="w-14 h-14" />
          </div>
          <div className="w-full pb-8 border-b border-gray-300 dark:border-dark-alt">
            <div className="bg-altcolor w-full  px-4 rounded-2xl shadow-md ">
              {/* header */}
              <div className="flex justify-between pt-3 pb-1">
                <div className="flex">
                  <h5 className="text-altcolor font-semibold">
                    {" "}
                    {message.receiver ? message.receiver.fullName : "Anonymous"}
                  </h5>
                  {message.receiver && (
                    <span className="ps-1 pt-1 text-sm">
                      @{message.receiver.username}
                    </span>
                  )}
                </div>
                <div>
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
              </div>
              <div className="flex items-baseline text-sm">
                Replying to
                <span className="text-primary ps-2">
                  {message.sender ? `@${message.sender.username}` : "Anonymous"}
                </span>
              </div>
              {/* content */}
              <div
                className="p-2 text-altcolor font-semibold font-body-play"
                dir="rtl"
              >
                {message.reply.content}
              </div>
              <div className="pt-2 pb-3 flex justify-between items-center">
                <div className="text-xs">
                  {formatDate(message.reply.timestamp)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
