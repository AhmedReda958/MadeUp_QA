import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { loginUser, registerUser } from "@/redux/actions/authActions";
import { determineLoginType } from "@/utils/helpers";
import { Form, Formik } from "formik";
import { FormTextInput } from "@/components/ui/FormElements";
import { Button } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Transition } from "@headlessui/react";

const LoginFrom = () => {
  // component animations
  const [animate, setAnimate] = useState(false);
  useEffect(() => setAnimate(true), []);

  const { logedin, loading, error, userToken } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitData = (values, { setSubmitting }) => {
    let loginData = determineLoginType(values);

    dispatch(loginUser(loginData));
  };

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={submitData}
    >
      <Transition as={Fragment} show={animate}>
        <Form className=" mt-10 text-body">
          <div className="mb-5">
            <Transition.Child
              as={"div"}
              enter="ease-in-out duration-[.4s]"
              enterFrom="opacity-0 -translate-x-32"
              enterTo="opacity-100 translate-x-0"
            >
              <FormTextInput
                name="username"
                type="text"
                icon={UserIcon}
                placeholder="Username or Email"
              />
            </Transition.Child>
          </div>
          <div className="mb-5">
            <Transition.Child
              as={"div"}
              enter="ease-in-out duration-[.6s]"
              enterFrom="opacity-0 -translate-x-32"
              enterTo="opacity-100 translate-x-0"
            >
              <FormTextInput
                name="password"
                type="password"
                icon={LockClosedIcon}
                placeholder="Password"
              />{" "}
            </Transition.Child>
          </div>
          <Transition.Child
            as={"div"}
            enter="ease-in-out duration-[.4s]"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 scale-100"
          >
            <Button
              type="submit"
              color="dark"
              disabled={loading}
              className="w-full mt-5"
              size={"lg"}
            >
              {loading && <i className="fa fa-spinner fa-spin-pulse mx-3"></i>}
              Login
            </Button>
          </Transition.Child>
        </Form>
      </Transition>
    </Formik>
  );
};

export default LoginFrom;
