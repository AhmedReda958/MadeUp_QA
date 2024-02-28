import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { loginUser, registerUser } from "@/redux/actions/authActions";
import { determineLoginType } from "@/utils/helpers";
import { Form, Formik } from "formik";
import { FormTextInput } from "@/components/ui/FormElements";
import { Button } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";

const LoginFrom = () => {
  const { logedin, loading, error, userToken } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const submitData = (values, { setSubmitting }) => {
    let loginData = determineLoginType(values);

    dispatch(loginUser(loginData));
  };
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={submitData}
    >
      <Form className=" mt-10 text-body">
        <div className="mb-5">
          <FormTextInput
            name="username"
            type="text"
            icon={UserIcon}
            placeholder="Username or Email"
          />
        </div>
        <div className="mb-5">
          <FormTextInput
            name="password"
            type="password"
            icon={LockClosedIcon}
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
          {loading && <i className="fa fa-spinner fa-spin-pulse mx-3"></i>}
          Login
        </Button>
      </Form>
    </Formik>
  );
};

export default LoginFrom;
