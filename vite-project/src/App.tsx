import Navbar from "./components/common/Navbar.tsx";
import { Routes , Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Events from "./pages/Events.tsx";
import Contact from "./pages/ContactUs.tsx";
import Footer from "./components/common/Footer.tsx";
import Event from "./pages/Event.tsx";
import TicketPage from "./pages/TicketPage.tsx";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hook";
import { loadStoredAuth } from "@/store/authSlice";
import Dashboard from "./pages/Dashboard.tsx";
import { NotificationProvider } from "@/components/ui/notification-provider";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadStoredAuth());
  }, [dispatch]);


  return (
    <NotificationProvider>
      <div className="bg-black text-white w-full h-full flex flex-col items-center justify-center gap-4">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path='/events/:id' element={<Event/>} />
          <Route path='ticket/:eventid' element={<TicketPage/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more routes as needed */}
          <Route path="*" element={<div>404 Not Found</div>} />

          {/* dashBoard */}
        </Routes>
        <Footer/>
      </div>
    </NotificationProvider>
  );
}

export default App;
