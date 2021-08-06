import React from "react";

function PopupWithForm(props) {
  return (
    <section className={`overlay ${props.isOpen && "overlay_opened"}`}>
      <div className={`popup popup_type_${props.name}`}>
        <form
          className="popup__container"
          name={props.name}
          onSubmit={props.onSubmit}
        >
          <h2 className="popup__heading">{props.title}</h2>
          {props.children}
          <button type="submit" className="popup__button">
            {props.submitText}
          </button>
        </form>
        <button
          onClick={props.onClose}
          type="button"
          className=" overlay__close popup__close"
        />
      </div>
    </section>
  );
}

export default PopupWithForm;
