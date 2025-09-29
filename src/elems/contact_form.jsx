// ContactUs.jsx
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactUs = ({ styling }) => {
  const formRef = useRef(null);
  const [status, setStatus] = useState({ sending: false, ok: null, msg: '' });

  const sendEmail = async (e) => {
    e.preventDefault();

    // Honeypot: if filled, likely a bot — silently exit
    if (e.currentTarget.elements['company_website']?.value) return;

    try {
      setStatus({ sending: true, ok: null, msg: '' });

      await emailjs.sendForm(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAIL_PUBLIC_KEY
      );

      setStatus({ sending: false, ok: true, msg: 'Message sent! We will reply as soon as we can.' });
      formRef.current?.reset();
    } catch (err) {
      console.error(err);
      setStatus({ sending: false, ok: false, msg: 'Sadly your message could not be sent. Please try again later! Or email us directly at info@maxiai.co.uk' });
    }
  };

  return (
    <div className="pb-25 pt-25 bg-[#FAFAFA]">
      <form
        ref={formRef}
        onSubmit={sendEmail}
        className={`max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6 ${styling}`}
      >
        {/* Hidden timestamp (optional) */}
        <input type="hidden" name="time" value={new Date().toISOString()} />

        {/* Honeypot field (hidden from users) */}
        <div className="hidden">
          <label>Leave this field empty</label>
          <input name="company_website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

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

        {/* Subject Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input 
            type="text" 
            name="subject" 
            placeholder="Enter subject" 
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
          />
        </div>

        {/* Submit Button + Status */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={status.sending}
            className={`w-full text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]
              ${status.sending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            {status.sending ? 'Sending…' : 'Send Message'}
          </button>

          {status.ok === true && (
            <p className="mt-3 text-green-700 text-sm">{status.msg}</p>
          )}
          {status.ok === false && (
            <p className="mt-3 text-red-700 text-sm">{status.msg}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
