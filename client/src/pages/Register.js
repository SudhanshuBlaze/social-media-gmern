import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useForm } from "../util/useForm";
import { useAuth } from "../context/auth";

export default function Register(props) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const initialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  // if directly pass the function addUser then it will read "undefined" as the addUser function declared later and since this function is stored in a const variable it's is not hoisted, hence we need to declare another function with "function" keyword such that it gets hoisted
  const { onChange, onSubmit, values } = useForm(registerUser, initialState);

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    // this "update" function will be triggered when the mutation is successful
    update(_, { data: { register: userData } }) {
      login(userData);
      // console.log(userData);
      navigate("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }

  return (
    <div className="form-container">
      {/* html5 by default tries to validate email field */}
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1 style={{ fontWeight: 100 }}>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
          type="text"
        />

        <Form.Input
          label="Email"
          placeholder="Email..."
          name="email"
          value={values.email}
          onChange={onChange}
          error={errors.email ? true : false}
          type="email"
        />

        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
          type="password"
        />

        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password..."
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword ? true : false}
          type="password"
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>

      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      #get these  fields back
      id
      email
      username
      createdAt
      token
    }
  }
`;
