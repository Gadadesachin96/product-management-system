import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const { login } = useAuth();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = (values, { setSubmitting }) => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const loggedInUser = registeredUsers.find(
      (user) => user.email === values.email.trim().toLowerCase() && user.password === values.password.trim()
    );

    if (loggedInUser) {
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      setLoginError("");
      navigate("/productpage");
    } else {
      setLoginError("Invalid email or password. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Log in to your account</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleLogin}>
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <Field 
                id="email" 
                name="email" 
                type="email" 
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage name="email" component="div" className="text-sm text-red-500 mt-1" />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <Field 
                id="password" 
                name="password" 
                type="password" 
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
            </div>
            {loginError && <div className="text-sm text-red-500 mb-4">{loginError}</div>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-blue-500 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
