import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = event => {
    setValues({
      ...values, // have prev values
      [event.target.name]: event.target.value, //update the field
    });
  };

  const onSubmit = event => {
    event.preventDefault();
    callback();
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};
