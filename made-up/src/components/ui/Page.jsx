import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useState, useEffect } from "react";
import { IonContent, IonHeader, IonPage } from "@ionic/react";

const Header = ({ title, backTo = "/home", children }) => {
  return (
    <IonHeader mode="ios" className="ion-no-border bg-maincolor">
      <div className="flex justify-between items-center ion-padding">
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
            to={backTo}
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
  const {
    title,
    children,
    backTo = "/home",
    className,
    loading = false,
    header = true,
  } = props;

  // component animations
  const [animate, setAnimate] = useState(false);
  useEffect(() => setAnimate(true), []);

  return (
    <IonPage fullscreen={true} className={`${className}`}>
      {header && <Header title={title} backTo={backTo} />}
      <IonContent fullscreen className="ion-padding">
        <div className="px-30">{!loading ? children : <LoadingSpinner />}</div>
      </IonContent>
    </IonPage>
  );
};

Page.Header = Header;
export default Page;
