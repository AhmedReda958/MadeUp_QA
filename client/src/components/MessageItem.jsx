import React, { Fragment, memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfilePic from "./ProfilePic";
import { formatDate } from "@/utils/helpers";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import useAlert from "@/utils/hooks/useAlert";
import { share } from "@/redux/slices/appSlice";
import {
  HeartIcon as HeartIconSolid,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import likeSound from "@/assets/sounds/wow.mp3";
import unLikeSound from "@/assets/sounds/ohShit.mp3";

import axios from "axios";

const MessageMenu = ({ type, message }) => {
  const Alert = useAlert();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  const receiver = message.receiver;
  const msgOwner = receiver?.username;

  const togglePrivateReply = () => {
    axios
      .patch(
        "/messages/message/" + message._id,
        { action: "private", state: !message.reply.private },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        Alert({
          title:
            (message.reply.private ? "Published" : "Hidden") + " the message",
          type: "success",
        });
        window.location.reload(); // TODO: just remove the message item
      })
      .catch((err) => {
        console.error(err.response.data);
        Alert({
          title: `Unable to ${
            message.reply.private ? "publish" : "hide"
          } the message`,
          type: "error",
        });
      });
  };

  const cancelReply = () => {
    axios
      .patch("/messages/message/" + message._id, { action: "cancel" })
      .then((res) => {
        Alert({ title: "Canceled the reply", type: "success" });
        window.location.reload(); // TODO: just remove the message item
      })
      .catch((err) => {
        console.error(err.response.data);
        Alert({ title: "Unable to cancel the reply", type: "error" });
      });
  };

  const togglePin = () => {
    console.log(message.pinned, !message.pinned);
    axios
      .patch(
        "/messages/message/" + message._id,
        { action: "pin", state: !message.pinned },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        Alert({
          title: (message.pinned ? "Unpinned" : "Pinned") + " the message",
          type: "success",
        });
        window.location.reload(); // TODO: just remove the message item
      })
      .catch((err) => {
        console.error(err.response.data);
        Alert({
          title: `Unable to ${message.pinned ? "unpin" : "pin"} the message`,
          type: "error",
        });
      });
  };

  const deleteMessage = () => {
    axios
      .delete("/messages/message/" + message._id)
      .then((res) => {
        Alert({ title: "Deleted the message", type: "success" });
        window.location.reload(); // TODO: just remove the message item
      })
      .catch((err) => {
        console.error(err.response.data);
        Alert({ title: "Unable to deleted the message", type: "error" });
      });
  };

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
          leave="transition ease-in duration-200"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-30 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="p-1">
              {type == "post" && msgOwner === userInfo.username && (
                <>
                  <Menu.Item>
                    <button
                      onClick={() =>
                        dispatch(
                          share({
                            text:
                              message.content + " - " + message?.reply.content,
                            url: location.origin + "/message/" + message._id,
                          })
                        )
                      }
                      className="text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm"
                    >
                      <i className="fa fa-share text-primary pe-3"></i>
                      Share answer
                    </button>
                  </Menu.Item>

                  <Menu.Item>
                    <button
                      onClick={cancelReply}
                      className="text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm"
                    >
                      <i className="fa fa-ban text-gray-500 pe-3"></i>
                      Cancel answer
                    </button>
                  </Menu.Item>

                  <Menu.Item>
                    <button
                      onClick={togglePin}
                      className="text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm"
                    >
                      <i className="fa fa-thumbtack text-gray-500 pe-3"></i>
                      {message.pinned ? "Unpin from " : "Pin in "} Profile
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button
                      onClick={togglePrivateReply}
                      className="text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm"
                    >
                      <i className="fa fa-eye-slash text-gray-500 pe-3"></i>
                      {message.reply.private
                        ? "Publish to Profile"
                        : "Hide from Profile"}
                    </button>
                  </Menu.Item>
                </>
              )}
              <Menu.Item>
                <button
                  onClick={() =>
                    Alert({ title: "Coming soon!", type: "comingsoon" })
                  }
                  className="text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm"
                >
                  <i className="fa fa-flag text-gray-500 pe-3"></i>
                  Report
                </button>
              </Menu.Item>
              {(type === "message") | (msgOwner === userInfo.username) ? (
                <Menu.Item>
                  <button
                    onClick={deleteMessage}
                    className="text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  >
                    <i className="fa fa-trash text-red-500 pe-3"></i>
                    Delete message
                  </button>
                </Menu.Item>
              ) : null}
            </div>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
};

// allowed types => [message , post]
const MessageItem = ({ message, type = "post" }) => {
  const navigate = useNavigate();

  const navigateToMessagePage = () => {
    if (type === "message") navigate("/messages/replay?id=" + message._id);
    else if (type === "post") navigate("/message/" + message._id);
  };

  return (
    <div className="pt-5 ">
      {/* message */}
      <div
        className={`flex mb-2 ${type === "post" && "post_after after:ms-7"}`}
      >
        {/* profile pic */}
        <div className="me-1 cursor-pointer">
          <Link to={message.sender && "/" + message.sender.username}>
            <ProfilePic
              data={message.sender}
              className="w-14 h-14"
              annoymous={!message.sender}
              showLastSeen
            />
          </Link>
        </div>

        <div className="bg-altcolor w-full  px-4 rounded-2xl shadow-md cursor-pointer">
          {/* header */}
          <div className="flex justify-between pt-3 pb-1 cursor-pointer">
            <Link to={message.sender && "/" + message.sender.username}>
              <div className="flex">
                <div className="flex items-center">
                  <h5 className="text-altcolor font-semibold truncate max-w-36">
                    {" "}
                    {message.sender ? message.sender.fullName : "Anonymous"}
                  </h5>
                  {message.sender?.verified && (
                    <CheckBadgeIcon className="w-5 h-5 ms-[2px] text-alt" />
                  )}
                </div>
                {message.sender && (
                  <span className="ps-1 pt-1 text-sm truncate max-w-20">
                    @{message.sender.username}
                  </span>
                )}
              </div>
            </Link>
            <div>
              <MessageMenu type={type} message={message} />
            </div>
          </div>
          {/* content */}
          <div
            className="p-2 text-altcolor font-semibold font-body-play"
            dir="rtl"
            onClick={navigateToMessagePage}
          >
            {message.content}
          </div>
          <div className="pt-2 pb-3 flex justify-between items-center">
            <div className="text-xs">{formatDate(message.timestamp)}</div>
            {type == "message" ? (
              <Link
                to={"/messages/replay?id=" + message._id}
                className="button-lg "
              >
                Replay
                <i className="fa fa-share ps-2 "></i>
              </Link>
            ) : (
              <LikeButton message={message} />
            )}
          </div>
        </div>
      </div>
      {/* replay */}
      {type === "post" && (
        <div className="flex mt-4">
          <div className="me-3 cursor-pointer">
            <Link to={message.receiver && "/" + message.receiver.username}>
              <ProfilePic
                data={message.receiver}
                className="w-14 h-14"
                showLastSeen
              />
            </Link>
          </div>
          <div className="w-full pb-6 border-b border-gray-300 dark:border-dark-alt">
            <div className="bg-altcolor w-full  px-4 rounded-2xl shadow-md cursor-pointer">
              {/* header */}
              <div className="flex justify-between pt-3 pb-1 cursor-pointer">
                <Link to={message.receiver && "/" + message.receiver.username}>
                  <div className="flex">
                    <div className="flex items-center">
                      <h5 className="text-altcolor font-semibold truncate max-w-36 ">
                        {" "}
                        {message.receiver
                          ? message.receiver.fullName
                          : "Anonymous"}
                      </h5>
                      {message.receiver?.verified && (
                        <CheckBadgeIcon className="w-5 h-5 ms-[2px] text-alt" />
                      )}
                    </div>
                    {message.receiver && (
                      <span className="ps-1 pt-1 text-sm truncate max-w-20">
                        @{message.receiver.username}
                      </span>
                    )}
                  </div>
                </Link>
                <div>
                  <MessageMenu type={type} message={message} />
                </div>
              </div>
              <div className="flex items-baseline text-sm leading-6 -mt-3">
                Replying to
                <span className="text-primary ps-1 max-w-30 truncate leading">
                  {message.sender ? `@${message.sender.username}` : "Anonymous"}
                </span>
              </div>
              {/* content */}
              <div
                onClick={navigateToMessagePage}
                className="p-2 text-altcolor font-semibold font-body-play"
                dir="rtl"
              >
                {message.reply.content}
              </div>
              <div className="pt-2 pb-3 flex justify-between items-center">
                <div className="text-xs">
                  {formatDate(message.reply.timestamp)}
                </div>
                {/* //todo: add likes to replay */}
                {/* <LikeButton message={message.reply} /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// like button
const LikeButton = memo(({ message }) => {
  const [liked, setLiked] = useState(message.liked);
  const [count, setCount] = useState(message.likes);
  // const navigate = useNavigate();
  // const logedIn = useSelector((state) => state.auth.logedIn);

  const likeHandler = async () => {
    // if (!logedIn) {
    //   navigate("/login");
    //   return;
    // }
    // const audio = new Audio(liked ? unLikeSound : likeSound);
    // audio.play();
    let action = !liked;
    let variation = action ? 1 : -1;
    setLiked(action);
    setCount(count + variation);
    await (action ? axios.put : axios.delete)(
      `/messages/likes/message/${message._id}`
    ).catch(() => {
      setLiked(!action);
      setCount(count - variation);
    });
  };

  return (
    <div className="flex items-center" onClick={likeHandler}>
      <span className={`text-xs pe-1 ${liked && "text-red-600"}`}>
        {count > 0 && count}
      </span>
      <div className="w-6 h-6 pointer overflow-hidden">
        {/* <Transition
          show={liked}
          enter=" ease-in-out duration-100 "
          enterFrom="rounded-full bg-red-700 opacity-80 scale-0"
          enterTo=" opacity-100 scale-100"
        >
          <div>
            <HeartIconSolid className="w-6 h-6  text-red-500 " />
          </div>
        </Transition>
        <Transition
          show={!liked}
          enter="transition ease-out duration-75"
          enterFrom="opacity-0 scale-0"
          enterTo="opacity-100 scale-100"
        >
          <HeartIcon className="w-6 h-6 text-gray-500 pe-1 " />
        </Transition> */}

        {liked ? (
          <HeartIconSolid className="w-6 h-6  text-red-500 " />
        ) : (
          <HeartIcon className="w-6 h-6 text-gray-500 pe-1 " />
        )}
      </div>
    </div>
  );
});

export default MessageItem;
