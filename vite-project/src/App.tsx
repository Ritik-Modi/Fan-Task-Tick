import Navbar from "./components/common/Navbar.tsx";
import { Routes , Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Events from "./pages/Events.tsx";
import Contact from "./pages/ContactUs.tsx";
import Footer from "./components/common/Footer.tsx";

function App() {
  return (
    <div className="bg-black text-white w-full h-full flex flex-col items-center justify-center gap-4">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
