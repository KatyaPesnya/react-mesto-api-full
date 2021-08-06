import React from "react";
import success from "../images/success.svg";
import notSuccess from "../images/not-success.svg";

function InfoTooltip(props) {
  return (
    <section className={`overlay ${props.isOpen && "overlay_opened"}`}>
      <div className={`popup popup_type_${props.name}`}>
        <div className="popup__container" name={props.name}>
          <img
            className="popup__icon"
            src={props.isSuccess ? success : notSuccess}
            alt={
              props.isSuccess
                ? "успешная регистрация"
                : "неуспешная регистрация"
            }
          />
          <h3 className="popup__title">
            {props.isSuccess
              ? "Вы успешно зарегистрировались"
              : "Что-то пошло не так! Попробуйте еще раз."}
          </h3>
        </div>
        <button
          onClick={props.onClose}
          type="button"
          className=" overlay__close popup__close"
        />
      </div>
    </section>
  );
}

export default InfoTooltip;
