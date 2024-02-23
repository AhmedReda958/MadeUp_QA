import React, { useCallback, useEffect, useState } from "react";
import mailboxImg from "@/assets/imgs/mailbox.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ProfilePic from "@/components/ProfilePic";
import { formatDate } from "@/utils/helpers";
import Page from "@/components/ui/Page";

// todo: applay user data for messages // wait for api
const MessageItem = ({ message }) => {
  return (
    <div className="flex mb-8">
      {/* profile pic */}
      <div className="me-2">
        <ProfilePic data={message} className="w-14 h-14" />
      </div>

      <div className="bg-altcolor w-full  px-4 rounded-2xl shadow-md">
        {/* header */}
        <div className="flex justify-between pt-3 pb-1">
          <div className="flex">
            <h5 className="text-altcolor font-semibold">
              {" "}
              {message.sender.fullName ? message.sender.fullName : "Anonymous"}
            </h5>
            {message.sender.username && (
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
          <Link to={"replay?id=" + message._id} className="pe-2 text-primary">
            <i class="fa-regular fa-paper-plane"></i>
          </Link>
        </div>
      </div>
      {/* action */}
    </div>
  );
};

function MessagesPage() {
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [messagesData, setMessagesData] = useState({});

  const getMessages = useCallback(() => {
    setLoading(true);
    axios
      .get(`/messages/inbox`, {
        params: {
          include: ["content", "timestamp"],
          user: "sender",
          page: 1,
          limit: 100,
        },
      })
      .then((res) => {
        setMessagesData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reload]);

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <Page title={"Messages"} loading={loading}>
      {messagesData.length > 0 ? (
        <>
          {messagesData.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </>
      ) : (
        <div>
          <img
            src={mailboxImg}
            className="max-w-60 m-auto mt-20 opacity-70 "
            alt=""
            draggable="false"
          />
          <div className="pt-12 ps-3 text m-auto">
            <p className="text-xl text-altcolor">There's no new messages</p>
            <p className="pt-1 text-sm font-light">
              Share your profile link to get more messages.
            </p>
          </div>
        </div>
      )}
    </Page>
  );
}

export default MessagesPage;
