import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeLink(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onAddPlace({
      name: name,
      link: link,
    })
  }
  
  React.useEffect(() => {
    setName('');
    setLink('')
  }, [props.isOpen]) 
  
  return (
    <PopupWithForm
      name="add"
      title="Новое место"
      submitText="Создать"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        id="title-input"
        type="text"
        name="caption"
        required
        minLength="2"
        maxLength="30"
        placeholder="Название"
        className="popup__input"
        value={name || ""}
        onChange={handleChangeName}
      />
      <span className="popup__input-error title-input-error" />
      <input
        id="url-input"
        type="url"
        name="url"
        required
        placeholder="Ссылка на картинку"
        className="popup__input"
        value={link || ""}
        onChange={handleChangeLink}
      />
      <span className="popup__input-error url-input-error" />
    </PopupWithForm>
  );
}
export default AddPlacePopup;
