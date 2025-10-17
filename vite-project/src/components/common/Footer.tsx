import logo from '@/assets/LOGO.png';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-black text-lightgray px-6 py-10 w-full">
      <div className="w-full flex flex-col md:flex-row justify-between items-start gap-20 border-b border-lightgray pb-8 pl-24 pr-24">
        {/* Logo and Description */}
        <div className="w-full md:w-[300px] flex flex-col gap-4">
          <img src={logo} alt="logo" className="w-[80px]" />
          <p>
            An all-in-one app for event planning — book everything and pay in one place.
          </p>
        </div>

        {/* Links - General */}
        <div className="flex flex-col gap-2">
          <h2 className="text-white font-semibold text-lg mb-2">General</h2>
          <p className="cursor-pointer hover:text-white" onClick={() => navigate('/')}>Home</p>
          <p className="cursor-pointer hover:text-white" onClick={() => navigate('/events')}>Events</p>
          <p className="cursor-pointer hover:text-white" onClick={() => navigate('/contact')}>Contact Us</p>
        </div>

        {/* Links - Learn More */}
        <div className="flex flex-col gap-2">
          <h2 className="text-white font-semibold text-lg mb-2">Learn More</h2>
          <p className="cursor-pointer hover:text-white" >Event Organizer</p>
          <p className="cursor-pointer hover:text-white" >Service Provider</p>
          <p className="cursor-pointer hover:text-white" >Terms & Conditions</p>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center mt-6 text-sm text-lightgray w-full">
        © 2024 Ritik Modi — All rights reserved
      </div>
    </footer>
  );
}

export default Footer;
