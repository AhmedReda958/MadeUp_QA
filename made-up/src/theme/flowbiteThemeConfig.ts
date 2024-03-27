type CustomTheme = {
  button: {
    color: {
      primary: string;
      alt: string;
    };
  };
};

const customTheme: CustomTheme = {
  button: {
    color: {
      primary: "bg-primary hover:bg-primary-dark text-white",
      alt: "bg-alt hover:bg-alt-dark text-white",
    },
  },
};

export default customTheme;
