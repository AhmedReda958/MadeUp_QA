import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Page from "@/components/ui/Page";
import MessageItem from "@/components/MessageItem";
import { markAsSeen } from "@/redux/actions/notificationsActions";
import { fetchMessages } from "@/redux/slices/contentSlice";
import mailboxImg from "@/assets/imgs/mailbox.svg";

function MessagesPage() {
  const dispatch = useDispatch();
  const { unseen } = useSelector((state) => state.app);
  const { data: messagesData, loading: messagesLoading } = useSelector(
    (state) => state.content.messages.received
  );

  useEffect(() => {
    fetchMessagesData();
    markMessagesAsSeen();
  }, []);

  const fetchMessagesData = () => {
    dispatch(fetchMessages());
  };

  const markMessagesAsSeen = () => {
    if (unseen.messages > 0) {
      dispatch(markAsSeen({ type: "messages" }));
    }
  };

  const messages = messagesData;
  const isLoading = messagesLoading && messages.length === 0;

  return (
    <Page title={"Messages"} backTo="/home" loading={isLoading}>
      {messages.length > 0 ? (
        <>
          {messages.map((message) => (
            <MessageItem key={message._id} message={message} type="message" />
          ))}
        </>
      ) : (
        <div>
          <img
            src={mailboxImg}
            className="max-w-60 m-auto mt-20 opacity-70 "
            alt=""
            draggable="false"
            loading="lazy"
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
