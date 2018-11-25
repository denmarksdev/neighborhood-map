import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ title, message }) => (
    <div className='error-container'>
        <h1 className='error-title' >Error: {title}</h1>
        <p className='error-message'>{message}</p>
    </div>
);

export default ErrorMessage;