import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Events from "./pages/Events.tsx";
import Contact from "./pages/ContactUs.tsx";
import Event from "./pages/Event.tsx";
import TicketPage from "./pages/TicketPage.tsx";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hook";
import { loadStoredAuth } from "@/store/authSlice";
import Dashboard from "./pages/Dashboard.tsx";
import { NotificationProvider } from "@/components/ui/notification-provider";
import Layout from "@/layout/Layout.tsx";
import AdminDashboard from "./components/dashboard/adminDashboard/AdminDashboard.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadStoredAuth());
  }, [dispatch]);

  return (
    <NotificationProvider>
      <Routes>
        {/* Routes with Main Layout (Navbar + Footer) */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<Event />} />
          <Route path="/ticket/:eventid" element={<TicketPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<div>404 Not Found</div>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Route>
      </Routes>
    </NotificationProvider>
  );
}

export default App;