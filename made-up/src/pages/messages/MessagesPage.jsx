import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Page from "@/components/ui/Page";
import MessageItem from "@/components/MessageItem";
import { markAsSeen } from "@/redux/actions/notificationsActions";
import { fetchMessages } from "@/redux/slices/contentSlice";
import mailboxImg from "@/assets/imgs/mailbox.svg";

// ionic
import {
  useIonViewWillEnter,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";

function MessagesPage() {
  const dispatch = useDispatch();
  const { unseen } = useSelector((state) => state.app);
  const { data: messagesData, loading: messagesLoading } = useSelector(
    (state) => state.content.messages.received
  );

  useIonViewWillEnter(() => {
    fetchMessagesData();
    markMessagesAsSeen();
  });

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
      {/* infinte scroll */}
      <IonInfiniteScroll
        onIonInfinite={(ev) => {
          if (messagesData.length % 10 !== 0) {
            // 10 is the limit
            ev.target.disabled = true;
            return;
          }
          fetchMessagesData();
          setTimeout(() => ev.target.complete(), 500);
        }}
      >
        <IonInfiniteScrollContent></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </Page>
  );
}

export default MessagesPage;
