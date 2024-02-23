import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Header = ({ title, children }) => {
  return (
    <div className="flex justify-between items-center py-2 mb-6 mt-3">
      <div className="flex items-center ">
        <h1 className="font-bold text-2xl font-logo text-black dark:text-white ps-1">
          MadeUp
        </h1>
        <h2 className="ms-5 border-s-2 border-body-alt ps-3 text-lg ">
          {title}
        </h2>
      </div>
      {/* back link */}

      {children ? (
        children
      ) : (
        <Link to="../" className="pt-1 pe-3 cursor-pointer">
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
      )}
    </div>
  );
};

const Page = ({ title, children, loading = false, header = true }) => {
  return (
    <div className="pb-20">
      {header && <Header title={title} />}

      {!loading ? children : <LoadingSpinner />}
    </div>
  );
};

Page.Header = Header;
export default Page;