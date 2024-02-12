import React, { useCallback, useEffect, useState } from "react";
import mailboxImg from "@/assets/imgs/mailbox.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MessageItem = ({ message }) => {
  return <div>{message.content}</div>;
};

function MessagesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [messagesData, setMessagesData] = useState({});

  const getMessages = useCallback(() => {
    setLoading(true);
    axios
      .get(`/messages/inbox?include=content&include=sender&include=timestamp`)
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
    <div>
      {/* header */}
      <div className="flex justify-between items-center py-2">
        <h3 className=" font-light text-lg">Messages</h3>
        <div className="pt-1 pe-3" onClick={() => navigate("/")}>
          <i className="fa-solid fa-arrow-right"></i>
        </div>
      </div>
      {/* messages */}
      {loading ? (
        <div className="text-2xl text-center mt-10">
          <i className="fa fa-spinner fa-spin-pulse "></i>
        </div>
      ) : (
        <div>
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
                className=" max-w-60 m-auto mt-20 opacity-70 "
                alt=""
                draggable="false"
              />
              <div className="pt-12 ps-3 text">
                <p className="text-xl text-altcolor">There's no new messages</p>
                <p className="pt-1 text-sm font-light">
                  Share your profile link to get more messages.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MessagesPage;
