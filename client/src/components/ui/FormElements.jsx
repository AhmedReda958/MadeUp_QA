import { Formik, Form, useField } from "formik";
import { Button, Checkbox, Label, TextInput, Textarea } from "flowbite-react";
import { useEffect, useRef } from "react";

const FormTextInput = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <>
      <div className="mb-2 block">
        <Label
          className=" font-display"
          htmlFor={props.id || props.name}
          value={label}
        />
      </div>
      <TextInput
        {...field}
        {...props}
        color={meta.touched && meta.error ? "failure" : null}
        helperText={
          meta.touched && meta.error ? <span>{meta.error}</span> : null
        }
      />
    </>
  );
};

const FormTextarea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const textareaRef = useRef(null);

  useEffect(() => {
    const input = textareaRef.current;
    input.style.height = "";
    input.style.height = input.scrollHeight + "px";
  }, [meta.value]);

  return (
    <>
      <div className="mb-2 block">
        <Label
          className=" font-display"
          htmlFor={props.id || props.name}
          value={label}
        />
      </div>
      <Textarea
        className=" resize-none overflow-hidden"
        ref={textareaRef}
        {...field}
        {...props}
        color={meta.touched && meta.error ? "failure" : null}
        helperText={
          meta.touched && meta.error ? <span>{meta.error}</span> : null
        }
      />
    </>
  );
};

const FormCheckbox = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <Checkbox
        {...field}
        {...props}
        color={meta.touched && meta.error ? "failure" : null}
        helperText={
          meta.touched && meta.error ? <span>{meta.error}</span> : null
        }
      />
      <Label htmlFor={props.id || props.name} value={label} />
    </>
  );
};

export { FormTextInput, FormTextarea, FormCheckbox };
