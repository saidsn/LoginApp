import toast from "react-hot-toast";
import { authenticate } from "./helper";

export async function UsernameValidate(values) {
  const errors = UsernameVerify({}, values);

  if (values.username) {
    const { status } = await authenticate(values.username);

    if (status !== 200) {
      errors.exsist = toast.error("User doesn't exsist...!");
    }
  }
  return errors;
}

export async function PasswordValidate(values) {
  const errors = PasswordVerify({}, values);
  return errors;
}

export async function ResetPasswordValidation(values) {
  const errors = PasswordVerify({}, values);

  if (values.password !== values.confirm_pwd) {
    errors.exsist = toast.error("Password not match...!");
  }
  return errors;
}

export async function RegisterValidation(values) {
  const errors = UsernameVerify({}, values);

  PasswordVerify(errors, values);

  EmailVerify(errors, values);

  return errors;
}

export async function ProfileValidation(values) {
  const errors = EmailVerify({}, values);

  return errors;
}

//////////////////////////////////////////////////////////
/*validate password*/
const PasswordVerify = (errors = {}, values) => {
  const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

  if (!values.password) {
    errors.password = toast.error("Password is required...!");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Wrong password...!");
  } else if (values.password.length < 4) {
    errors.password = toast.error("Password must be at least 4 characters");
  } else if (values.password.length > 10) {
    errors.password = toast.error("Password must not exceed 10 characters");
  } else if (!specialChars.test(values.password)) {
    errors.password = toast.error("Password must be special characters");
  }
  return errors;
};

/*validate username*/
const UsernameVerify = (errors = {}, values) => {
  if (!values.username) {
    errors.username = toast.error("Username is required...!");
  } else if (values.username.includes(" ")) {
    errors.username = toast.error("Invalid Username...");
  }
  return errors;
};

/*validate email*/
const EmailVerify = (errors = {}, values) => {
  const specialChars = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!values.email) {
    errors.email = toast.error("Email is required...!");
  } else if (values.email.includes(" ")) {
    errors.email = toast.error("Wrong email...!");
  } else if (!specialChars.test(values.email)) {
    errors.email = toast.error("Invalid email address...!");
  }
  return errors;
};
