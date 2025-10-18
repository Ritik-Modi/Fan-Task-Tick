import Logo from "../../assets/LOGO.png";
import { navbarLinks } from "@/data/navbar_links";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import UserDropdown from "./UserDropDown";
import { logout } from "@/store/authSlice.ts";
import { useAppDispatch, useAppSelector } from "@/store/hook.ts";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
// import { Menu, X } from "lucide-react";

function Navbar() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    // setMobileMenuOpen(false);
    console.log("User logged out");
  };

  // const handleNavClick = () => {
  //   // setMobileMenuOpen(false);
  // };

  return (
    <>
      <div className="sticky top-0 z-50 bg-black text-white w-full h-[100px] flex items-center justify-between px-4 ">
        {/* Logo - Always visible */}
        <div className="max-h-[100px] max-w-[100px]">
          <NavLink to={"/"}>
            <img
              src={Logo}
              alt="logo"
              className="h-full w-auto object-contain"
            />
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            <div>
              <ul className="flex gap-8 text-lg">
                {navbarLinks.map((link, index) => (
                  <li key={index} className="navbarLink cursor-pointer">
                    <NavLink
                      to={link.href}
                      className={({ isActive }) =>
                        isActive ? "navbarLinkActive" : ""
                      }
                    >
                      {link.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-2">
              {!token ? (
                <>
                  <Button variant="default2" onClick={() => navigate("/login")}>
                    <span>Login</span>

                  </Button>
                  <Button onClick={() => navigate("/signup")}>
                    <span>Sign Up</span>
                  </Button>
                </>
              ) : (
                <UserDropdown
                  showLogout={true}
                  onLogout={handleLogout}
                  user={{
                    fullName: user?.fullName,
                    email: user?.email,
                    avatar: user?.avatar,
                  }}
                  showDashboard={true}
                  showProfile={true}
                  onDashboard={() => navigate("/dashboard")}
                  onProfile={() => navigate("/profile")}
                />
              )}
            </div>
          </>
        )}

        {/* Mobile Menu Button & Auth */}
        {isMobile && (
          <div className="flex items-center gap-4">
            {/* Auth Buttons or User Dropdown */}
            {token && (
              <UserDropdown
                onLogout={handleLogout}
                user={{
                  fullName: user?.fullName,
                  email: user?.email,
                  avatar: user?.avatar,
                }}
                showDashboard={true}
                showProfile={true}
                onHome={() => navigate("/")}
                onDashboard={() => navigate("/dashboard")}
                onProfile={() => navigate("/profile")}
                onEvents={() => navigate("/events")}
                onContacts={() => navigate("/contacts")}
              />
            )}

            {!token && (
              <UserDropdown
                onHome={() => navigate("/")}
                onEvents={() => navigate("/events")}
                onContacts={() => navigate("/contacts")}
                showLogin={true}
                showSignUp={true}
                onLogin={() => {navigate("/login")}}
                onSignUp={() => {navigate("/signup")}}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
