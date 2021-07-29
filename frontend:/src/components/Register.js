import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register({ onRegister }) {
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    onRegister(registerData);
  }

  return (
    <div className="register">
      <h3 className="register__info">Регистрация</h3>
      <form onSubmit={handleSubmit} className="register__form">
        <input
          required
          name="email"
          type="email"
          className="register__input"
          placeholder="Email"
          onChange={handleChange}
          value={registerData.email}
        />
        <input
          required
          name="password"
          type="password"
          className="register__input"
          placeholder="Пароль"
          onChange={handleChange}
          value={registerData.password}
        />
        <button type="submit" className="register__button">
           Зарегистрироваться{" "}
        </button>
      </form>
      <p className="register__paragraph">
        Уже зарегистриваны?{" "}
        <Link className="register__link" to="/sing-in">
          {" "}
          Войти{" "}
        </Link>
      </p>
    </div>
  );
}

export default Register;
