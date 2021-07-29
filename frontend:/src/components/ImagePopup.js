import React from "react";

function ImagePopup(props) {
  return (
    <section
      className={`overlay overlay_type_preview ${
        props.card && "overlay_opened"
      }`}
      aria-label="#"
    >
      <div className="overlay__container overlay__container_type_image">
        <img
          src={props.card && props.card.link}
          alt={`Фотография ${props.card && props.card.name} `}
          className="overlay__image"
        />
        <h2 className="overlay__caption">{props.card && props.card.name}</h2>
        <button
          onClick={props.onClose}
          type="button"
          className="overlay__close  overlay__close_type_image"
        />
      </div>
    </section>
  );
}

export default ImagePopup;
