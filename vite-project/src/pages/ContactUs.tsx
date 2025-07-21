import { useState } from "react";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Send to API or email service
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-10 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-darkgray text-white placeholder-gray-400 focus:outline-none"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="px-4 py-2 rounded-full bg-darkgray text-white placeholder-gray-400 focus:outline-none"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="px-4 py-2 rounded-2xl bg-darkgray text-white placeholder-gray-400 focus:outline-none resize-none"
          required
        />
        <button
          type="submit"
          className="mt-2 px-6 py-2 bg-mint text-black font-semibold rounded-full hover:bg-mint/90 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default ContactUs;
