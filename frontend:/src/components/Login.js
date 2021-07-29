import React, { useState } from "react";

function Login({ onLogin, onCheckToken}) {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    onLogin(loginData);
  }

  return (
    <div className="login">
      <h3 className="login__info">Вход</h3>
      <form onSubmit={handleSubmit} className="login__form">
        <input
          required
          name="email"
          type="email"
          className="login__input"
          placeholder="Email"
          onChange={handleChange}
          value={loginData.email}
        />
        <input
          required
          name="password"
          type="password"
          className="login__input"
          placeholder="Пароль"
          onChange={handleChange}
          value={loginData.password}
        />
        <button type="submit" className="login__button">
           Войти{" "}
        </button>
      </form>
    </div>
  );
}

export default Login;
