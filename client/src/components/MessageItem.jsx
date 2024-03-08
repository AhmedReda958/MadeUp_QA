import React, { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfilePic from "./ProfilePic";
import { formatDate } from "@/utils/helpers";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import useAlert from "@/utils/hooks/useAlert";
import { share } from "@/redux/slices/appSlice";

const MessageMenu = ({ type, message }) => {
  const Alert = useAlert();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  const receiver = message.receiver;
  const msgOwner = receiver?.username;

  return (
    <Menu as="div" className="relative inline-block text-left">
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
              {type == "post" && msgOwner === userInfo.username && (
                <>
                  <Menu.Item>
                    <button
                      onClick={() =>
                        dispatch(
                          share({
                            text: message.content,
                            url: "/message/" + message._id,
                          })
                        )
                      }
                      className="text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm"
                    >
                      <i className="fa fa-share text-primary pe-3"></i>
                      Share your answer
                    </button>
                  </Menu.Item>

                  <Menu.Item>
                    <button
                      onClick={() =>
                        Alert({ title: "Coming soon!", type: "comingsoon" })
                      }
                      className="text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm"
                    >
                      <i className="fa fa-thumbtack text-gray-500 pe-3"></i>
                      Pin in your Profile
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button
                      onClick={() =>
                        Alert({ title: "Coming soon!", type: "comingsoon" })
                      }
                      className="text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm"
                    >
                      <i className="fa fa-eye-slash text-gray-500 pe-3"></i>
                      Hide from Profile
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
                    onClick={() =>
                      Alert({ title: "Coming soon!", type: "comingsoon" })
                    }
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
  const navigateToReplayPage = () => {
    type === "message" && navigate("replay?id=" + message._id);
  };
  return (
    <div className="pt-5 ">
      {/* message */}
      <div
        className={`flex mb-2 ${type === "post" && "post_after after:ms-7"}`}
      >
        {/* profile pic */}
        <div className="me-1">
          <ProfilePic data={message} className="w-14 h-14" />
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
              <MessageMenu type={type} message={message} />
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
        <div className="flex mt-4">
          <div className="me-3 ">
            <ProfilePic data={message.receiver} className="w-14 h-14" />
          </div>
          <div className="w-full pb-6 border-b border-gray-300 dark:border-dark-alt">
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
                  <MessageMenu type={type} message={message} />
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
