import React from 'react';

const Contact = ({ name, email, phone }) => {
  return (
    <div className="contact">
      <h3>{name}</h3>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
    </div>
  );
};

export default Contact;
