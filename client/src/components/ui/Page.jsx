import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Header = ({ title }) => {
  return (
    <div className="flex justify-between items-center py-2 mb-6 mt-3">
      <div className="flex items-center ">
        <img src="/logo.png" alt="logo" className="w-10" draggable="false" />
        <h2 className="ms-5 border-s-2 border-body-alt ps-4 text-xl">
          {title}
        </h2>
      </div>
      {/* back link */}
      <Link to="../" className="pt-1 pe-3 cursor-pointer">
        <i className="fa-solid fa-arrow-left"></i>
      </Link>
    </div>
  );
};

const Page = ({ title, children, loading = false }) => {
  return (
    <div className="pb-20">
      <Header title={title} />

      {!loading ? children : <LoadingSpinner />}
    </div>
  );
};

export default Page;
