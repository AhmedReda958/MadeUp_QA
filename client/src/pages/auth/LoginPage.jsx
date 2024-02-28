import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserIcon } from "@heroicons/react/24/outline";
import { loginUser, registerUser } from "@/redux/actions/authActions";
import { determineLoginType } from "@/utils/helpers";
import { Form, Formik } from "formik";
import { FormTextInput } from "@/components/ui/FormElements";
import { Button } from "flowbite-react";
import useAlert from "@/utils/hooks/useAlert";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);

  const navigate = useNavigate();
  const Alert = useAlert();

  const { logedin, loading, error, userToken } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (userToken) navigate("/");
  }, []);

  useEffect(() => {
    if (error) Alert({ type: "error", title: "Wrong username or password" });
  }, [error]);

  const submitData = (values, { setSubmitting }) => {
    let loginData = determineLoginType(values);

    dispatch(loginUser(loginData));
  };

  return (
    <div className={app.isDarkTheme ? "dark" : "light"}>
      <main className="font-body min-h-screen min-w-screen  bg-light text-body-alt dark:bg-dark dark:text-secondary-alt">
        <div className="relative container w-full h-screen no-scrollbar max-w-[768px] mx-auto md-7 overflow-y-auto scroll-smooth">
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={submitData}
          >
            <Form className="px-5">
              <div className="mb-3">
                <FormTextInput
                  name="username"
                  type="text"
                  icon={UserIcon}
                  placeholder="Username or Email"
                />
              </div>
              <div className="mb-3">
                <FormTextInput
                  name="password"
                  type="password"
                  icon={UserIcon}
                  placeholder="Password"
                />
              </div>
              <Button
                type="submit"
                color="dark"
                disabled={loading}
                className="w-full mt-5"
                size={"lg"}
              >
                {loading && (
                  <i className="fa fa-spinner fa-spin-pulse mx-3"></i>
                )}
                Login
              </Button>
              <Link to="/register" className=" mt-3 text-center block">
                Create new account
              </Link>
            </Form>
          </Formik>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
