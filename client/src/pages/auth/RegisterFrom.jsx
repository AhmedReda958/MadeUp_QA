const RegisterFrom = () => {
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
      initialValues={{ fullName: "", username: "", password: "" }}
      onSubmit={submitData}
    >
      <Form className=" px-10 mt-10">
        <div className="mb-5">
          <FormTextInput
            name="fullName"
            type="text"
            icon={UserIcon}
            placeholder="Full name"
          />
        </div>
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
        <Link to="/register" className=" mt-4 text-center  block text-white">
          Create new account
        </Link>
      </Form>
    </Formik>
  );
};

export default RegisterFrom;
