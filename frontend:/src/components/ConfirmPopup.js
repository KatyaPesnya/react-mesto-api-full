import React from 'react';

import PopupWithForm from './PopupWithForm';

function ConfirmPopup(props) {
  return (
    <PopupWithForm
      name="confirm"
      title={props.title}
      submitText={props.submitText}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={props.onSubmit}
    >
    </PopupWithForm>
  )
}

export default ConfirmPopup;