import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useState, useEffect } from "react";
import { IonContent, IonHeader, IonPage } from "@ionic/react";

const Header = ({ title, children }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    const main = document.querySelector("#main-app");

    const onScroll = () => {
      let lastScroll = 0;
      main.addEventListener("scroll", () => {
        let currentScroll = main.scrollTop;

        setIsSticky(currentScroll < lastScroll && currentScroll > 100);
        setIsShown(currentScroll < lastScroll || currentScroll < 650);

        lastScroll = currentScroll;
      });
    };

    onScroll();

    return () => {
      main.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <IonHeader
      mode="ios"
      className={`ion-no-border bg-maincolor  ${
        isSticky && "fixed top-0 left-0 py-0 mb-0"
      }`}
    >
      <div
        className={`flex justify-between items-center ion-padding ${
          isSticky &&
          "m-auto  w-full  px-5 max-w-[768px] drop-shadow-sm bg-maincolor"
        }`}
      >
        <div className="flex items-center">
          <h1 className="font-bold text-2xl font-logo text-black dark:text-white ps-1">
            MadeUp
          </h1>
          <h2 className="ms-5 border-s-2 border-body-alt ps-3 text-lg">
            {title}
          </h2>
        </div>
        {/* back link */}

        {children ? (
          children
        ) : (
          //
          <Link
            to={"../"}
            className="pt-1 pe-3 cursor-pointer transition-all hover:text-primary duration-100 ease-in-out"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
        )}
      </div>
    </IonHeader>
  );
};

const Page = (props) => {
  const { title, children, className, loading = false, header = true } = props;

  // component animations
  const [animate, setAnimate] = useState(false);
  useEffect(() => setAnimate(true), []);

  return (
    <IonPage fullscreen={true} className={`${className}`}>
      {header && <Header title={title} />}
      <IonContent fullscreen className="ion-padding">
        <div className="px-30">{!loading ? children : <LoadingSpinner />}</div>
      </IonContent>
    </IonPage>
  );
};

Page.Header = Header;
export default Page;
