// ContactUs.jsx
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { UNSAFE_decodeViaTurboStream } from 'react-router-dom';

const ContactUs = ({styling}) => {
  const form = useRef();
  const sendEmail = e => {
    e.preventDefault();

    emailjs
      .sendForm(import.meta.env.VITE_EMAIL_SID, 
                import.meta.env.VITE_EMAIL_TID, 
                form.current, 
                import.meta.env.VITE_EMAIL_KEY
      )
      .then(
        result => {
          alert('Message sent successfully!');
          form.current.reset();
        },
        error => {
          alert('Failed to send message. Please try again.');
        }
      );
  };

  return (
    <div className='pb-25 pt-25 bg-[#FAFAFA]'>
      <form ref={form} onSubmit={sendEmail} className={`max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6 ${styling}`}>
      {/* Name Fields Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input 
            type="text" 
            name="first_name" 
            placeholder="Enter your first name" 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input 
            type="text" 
            name="last_name" 
            placeholder="Enter your last name" 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Email Address</label>
        <input 
          type="email" 
          name="user_email" 
          placeholder="Enter your email address" 
          required 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
        />
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea 
          name="message" 
          placeholder="Tell us about your project or inquiry..." 
          required
          rows="5"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 resize-vertical"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Send Message
        </button>
      </div>
      </form>
    </div>
  );
};

export default ContactUs;
