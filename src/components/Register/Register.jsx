import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  let navigate = useNavigate();
  const [errorList, setErrorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeat_password: "",
  });

  function getUser(e) {
    let myUser = { ...user };
    myUser[e.target.name] = e.target.value;
    setUser(myUser);
  }

  async function submitRegister(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let validationResult = validateRegisterForm(user, {
        abortEarly: false,
      });
      console.log(validationResult);
      if (validationResult.error) {
        setIsLoading(false);
        setErrorList(validationResult.error.details);
      } else {
        let { data } = await axios.post(
          `https://registersystem1010.herokuapp.com/users`,
          user
        );
        if (data.message === "CREATED SUCCESS") {
          setIsLoading(false);
          navigate("/login");
          //Navigate to Login
        } else {
          setError(data.message);
          setIsLoading(false);
        }
      }
    } catch (error) {
      setError(error.response.data.message);
      setIsLoading(false);
    }
  }

  function validateRegisterForm(user) {
    let schema = Joi.object({
      firstName: Joi.string().alphanum().min(3).required(),
      lastName: Joi.string().alphanum().required(),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      repeat_password: Joi.ref("password"),
    });

    return schema.validate(user);
  }

  return (
    <>
      <h2 className="my-3">Register Now</h2>
      {errorList.length < 0
        ? ""
        : errorList.map((error, index) => (
            <div key={index} className="alert alert-danger">
              {error.message}
            </div>
          ))}

      {error ? <div className="alert alert-danger">{error}</div> : ""}
      <form onSubmit={submitRegister}>
        <label htmlFor="firstName" className="mt-3 mb-2">
          First Name:{" "}
        </label>
        <input
          onChange={getUser}
          type="text"
          className="form-control"
          name="firstName"
          id="firstName"
        />

        <label htmlFor="lastName" className="mt-3 mb-2">
          Last Name:{" "}
        </label>
        <input
          onChange={getUser}
          type="text"
          className="form-control"
          name="lastName"
          id="lastName"
        />

        <label htmlFor="email" className="mt-3 mb-2">
          Email:{" "}
        </label>
        <input
          onChange={getUser}
          type="email"
          className="form-control"
          name="email"
          id="email"
        />

        <label htmlFor="password" className="mt-3 mb-2">
          Password:{" "}
        </label>
        <input
          onChange={getUser}
          type="password"
          className="form-control"
          name="password"
          id="password"
        />

        <label htmlFor="repeat_password" className="mt-3 mb-2">
          Confirm Password:{" "}
        </label>
        <input
          onChange={getUser}
          type="password"
          className="form-control"
          name="repeat_password"
          id="repeat_password"
        />

        <button type="submit" className="btn btn-outline-info my-4">
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Register"}
        </button>
      </form>
    </>
  );
}
