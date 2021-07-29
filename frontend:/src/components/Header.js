import React from "react";
import logo from "../images/header-logo.svg";
import { NavLink, useLocation } from "react-router-dom";

function Header({ loggedIn, onSignOut, authorizationEmail }) {
  const location = useLocation();

  const [menuIsOpen, setMenuIsOpen] = React.useState(false);

  function handleToggleMenu() {
    setMenuIsOpen(!menuIsOpen);
  }

  function handleSignOut() {
    setMenuIsOpen(false);
    onSignOut();
  }

  return (
    <header
      className={
        loggedIn
          ? "header header_row-reverse page__content"
          : "header page__content"
      }
    >
     
      {loggedIn && (
        <div
          className={
            menuIsOpen
              ? "header__container header__container_opened"
              : "header__container"
          }
        >
          <address className="header__address">
            {authorizationEmail && authorizationEmail}
          </address>
          <button
            className="header__button"
            type="button"
            onClick={handleSignOut}
          >
            Выйти
          </button>
        </div>
      )}
      <div className="header__container-main">
      <img src={logo} alt="логотип Mesto Russia" className="header__logo" />
        {loggedIn && (
          <button
            className={
              menuIsOpen
                ? "header__menu-button header__menu-button_opened"
                : "header__menu-button"
            }
            type="button"
            onClick={handleToggleMenu}
          />
        )}
        {!loggedIn && (
          <nav>
            {location.pathname === "/sign-in" && (
              <NavLink className="header__navlink" to="/sign-up">
                Регистрация
              </NavLink>
            )}
            {location.pathname === "/sign-up" && (
              <NavLink className="header__navlink" to="sign-in">
                Войти
              </NavLink>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
