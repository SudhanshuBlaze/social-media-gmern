// module.exports is an object that contains this arrow function
module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  // const regExPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const regExEmail =
    /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

  if (username.trim() === "") errors.username = "Username must not be empty";

  if (email.trim() === "") errors.email = "Email must not be empty";
  else {
    if (!email.match(regExEmail))
      errors.email = "Email must be a valid email address";
  }

  if (password.trim() === "") errors.password("Password must not be empty");
  // else if (!password.match(regExPassword))
  //   errors.password =
  //     "Password must have atleast 8 character, with at least a symbol, upper and lower case letters and a number";
  else if (password !== confirmPassword)
    errors.confirmPassword = "Passwords must match";

  return {
    errors,
    valid: Object.keys(errors).length < 1, //this will contain true or false depending upon if there's any error or not
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") errors.username = "Username must not be empty";
  if (password === "") errors.password = "Password must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length < 1, //this will contain true or false depending upon if there's any error or not
  };
};
