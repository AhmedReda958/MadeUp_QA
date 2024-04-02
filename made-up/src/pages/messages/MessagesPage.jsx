import React, { useEffect, useMemo } from "react";

// components
import Page from "@/components/ui/Page";
import MessageItem from "@/components/MessageItem";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// redux
import { useSelector, useDispatch } from "react-redux";
import { markAsSeen } from "@/redux/actions/notificationsActions";
import { fetchMessages } from "@/redux/slices/contentSlice";

// assets
import mailboxImg from "@/assets/imgs/mailbox.svg";

// ionic
import {
  useIonViewDidEnter,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { refreshReceivedMessages } from "../../redux/slices/contentSlice";

function MessagesPage() {
  const dispatch = useDispatch();
  const { unseen } = useSelector((state) => state.app);
  const { data: messagesData, loading: messagesLoading } = useSelector(
    (state) => state.content.messages.received
  );

  useIonViewDidEnter(() => {
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

  const handleRefresh = async (ev) => {
    setTimeout(() => {
      dispatch(refreshReceivedMessages());
      dispatch(fetchMessages());
      ev.detail.complete();
    }, 500);
  };

  const messages = useMemo(() => messagesData, [messagesData]);
  const isLoading = messagesLoading && messages.length === 0;

  return (
    <Page title={"Messages"} backTo="/home">
      {/* // refresher */}
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      {/* // content */}
      <div>
        {messages.length > 0 ? (
          <div>
            {messages.map((message) => (
              <MessageItem key={message._id} message={message} type="message" />
            ))}
          </div>
        ) : (
          <div>
            {isLoading && <LoadingSpinner />}
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
      </div>
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
