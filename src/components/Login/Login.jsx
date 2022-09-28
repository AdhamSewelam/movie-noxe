import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  let navigate = useNavigate();
  const [errorList, setErrorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  function getUser(e) {
    let myUser = { ...user };
    myUser[e.target.name] = e.target.value;
    setUser(myUser);
  }

  async function submitLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let validationResult = validateLoginForm(user, {
        abortEarly: false,
      });
      if (validationResult.error) {
        setIsLoading(false);
        setErrorList(validationResult.error.details);
      } else {
        let { data } = await axios.post(
          `https://registersystem1010.herokuapp.com/auth`,
          user
        );
        if (data.message === "LOGIN SUCCESS") {
          localStorage.setItem("userToken", JSON.stringify(data.token));
          localStorage.setItem("userData", JSON.stringify(data.data));
          setIsLoading(false);
          props.getUserData();
          navigate("/home");
          //Navigate to Home
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

  function validateLoginForm(user) {
    let schema = Joi.object({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });

    return schema.validate(user);
  }

  return (
    <>
      <h2 className="my-3">Login Now</h2>
      {errorList.length < 0
        ? ""
        : errorList.map((error, index) => (
            <div key={index} className="alert alert-danger">
              {error.message}
            </div>
          ))}

      {error ? <div className="alert alert-danger">{error}</div> : ""}
      <form onSubmit={submitLogin}>
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

        <button type="submit" className="btn btn-outline-info my-4">
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "login"}
        </button>
      </form>
    </>
  );
}
