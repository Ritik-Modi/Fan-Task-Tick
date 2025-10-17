import { useState } from "react";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Send to API or email service
  };

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-[#0a0a0a] text-white px-4 sm:px-6 lg:px-12 py-16">
      {/* === Title === */}
      <section className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
          Contact Us
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto">
          Have a question, feedback, or partnership inquiry? We’d love to hear from you!
        </p>
      </section>

      {/* === Contact Form === */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col gap-5 bg-[#141414] p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-800"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="px-4 py-3 rounded-full bg-[#1f1f1f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mint w-full"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-3 rounded-full bg-[#1f1f1f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mint w-full"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="message" className="text-sm text-gray-300 mb-1">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="px-4 py-3 rounded-2xl bg-[#1f1f1f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mint resize-none w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 px-6 py-3 bg-mint text-black font-semibold rounded-full hover:bg-mint/90 active:scale-[0.98] transition-all duration-150 shadow-md"
        >
          Send Message
        </button>
      </form>

      {/* === Footer Text === */}
      <p className="text-gray-500 text-sm mt-8 sm:mt-10 text-center max-w-md">
        We usually respond within 24 hours. Thank you for reaching out!
      </p>
    </main>
  );
}

export default ContactUs;
