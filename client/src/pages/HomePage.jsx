import ProfilePic from "@/components/ProfilePic";
import Page from "@/components/ui/Page";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

function HomePage() {
  const app = useSelector((state) => state.app);
  const user = useSelector((state) => state.auth.userInfo);

  return (
    <>
      {/* header */}
      <Page header={false}>
        <Page.Header title="Discovery">
          <Link to={`/${user.username}`} className=" drop-shadow-xl">
            <ProfilePic data={user} className="h-10 w-10" border={false} />
          </Link>
        </Page.Header>
      </Page>
      Discovery
    </>
  );
}

export default HomePage;
