import React, { useCallback, useEffect, useMemo, useState } from "react";
import mailboxImg from "@/assets/imgs/mailbox.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Page from "@/components/ui/Page";
import MessageItem from "@/components/MessageItem";

function MessagesPage() {
  const [loading, setLoading] = useState(false);
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
  }, [messagesData]);

  useEffect(() => {
    getMessages();
  }, []);

  const messages = useMemo(() => messagesData, [messagesData]);

  return (
    <Page title={"Messages"} loading={loading}>
      {messages.length > 0 ? (
        <>
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} type="message" />
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
          <div className="pt-12 ps-3 text m-auto w-80">
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
