import React from 'react';
import "./modalwindow.css" 

 export const ModalWindow = ({ active,  children }) => {
  return (
    <div
      className={active ? "modal__window active" : "modal__window"}
    >
      <div
        className={active ? "modal__content active" : "modal__content"}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}; 

