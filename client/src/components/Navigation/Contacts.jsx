import React from 'react';
import Contact from './Contact';

const Contacts = () => {
  const contactList = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321' },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '555-123-4567' },
  ];

  return (
    <div className="Contacts">
      <h2>Contacts</h2>
      {contactList.map(contact => (
        <Contact key={contact.id} name={contact.name} email={contact.email} phone={contact.phone} />
      ))}
    </div>
  );
};

export default Contacts;
