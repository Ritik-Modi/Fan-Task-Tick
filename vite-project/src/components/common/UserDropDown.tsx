import { useState, useRef, useEffect } from "react";
import {
  ChevronUp,
  LogOut,
  LayoutDashboard,
  User,
  Settings,
  Home,
  Users,
  Calendar,
  UserPlus
  
} from "lucide-react";



interface UserDropdownProps {
  user?: {
    fullName?: string;
    email?: string;
    avatar?: string;
  };
  onLogout: () => void;
  onDashboard?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  onHome?: () => void;
  onEvents?: () => void;
  onContacts?: () => void;
  onLogin?: () => void;
  onSignUp?: () => void;
  showLogout?: boolean;
  showDashboard?: boolean;
  showProfile?: boolean;
  showSettings?: boolean;
  showHome?: boolean;
  showEvents?: boolean;
  showContacts?: boolean;
  showLogin?: boolean;
  showSignUp?: boolean;
}

function UserDropdown({
  user,
  onLogout,
  onDashboard,
  onProfile,
  onSettings,
  onHome,
  onEvents,
  onContacts,
  onLogin,
  onSignUp,
  showLogout = true,
  showDashboard = true,
  showProfile = true,
  showSettings = true,
  showHome = true,
  showEvents = true,
  showContacts = true,
  showLogin = true,
  showSignUp = true,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (callback?: () => void) => {
    setIsOpen(false);
    callback?.();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 flex items-center gap-2 px-3 rounded-lg hover:bg-gray-800 transition-colors text-white"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium overflow-hidden flex-shrink-0">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{getUserInitials()}</span>
          )}
        </div>

        {/* Arrow Icon */}
        <ChevronUp
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50"
          style={{
            animation: "slideDown 0.2s ease-out",
          }}
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-sm font-medium text-white truncate">
              {user?.fullName || "Guest User"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || ""}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {showHome && onHome && (
              <button
                onClick={() => handleItemClick(onHome)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-gray-800 transition-colors cursor-pointer text-left"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm">Home</span>
              </button>
            )}

            {showEvents && onEvents && (
              <button
                onClick={() => handleItemClick(onEvents)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-gray-800 transition-colors cursor-pointer text-left"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Events</span>
              </button>
            )}

            {showContacts && onContacts && (
              <button
                onClick={() => handleItemClick(onContacts)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-gray-800 transition-colors cursor-pointer text-left"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm">Contacts</span>
              </button>
            )}

            {showDashboard && onDashboard && (
              <button
                onClick={() => handleItemClick(onDashboard)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-gray-800 transition-colors cursor-pointer text-left"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </button>
            )}

            {showProfile && onProfile && (
              <button
                onClick={() => handleItemClick(onProfile)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-gray-800 transition-colors cursor-pointer text-left"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Profile</span>
              </button>
            )}

            {showSettings && onSettings && (
              <button
                onClick={() => handleItemClick(onSettings)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-gray-800 transition-colors cursor-pointer text-left"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
            )}
          </div>

          {showLogin && onLogin && (
            <button
              onClick={() => handleItemClick(onLogin)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-gray-800 transition-colors cursor-pointer text-left"
            >
                <User className="w-4 h-4" />
                <span className="text-sm">Login</span>
            </button>
          )}


          {showSignUp && onSignUp && (
            <button
              onClick={() => handleItemClick(onSignUp)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-gray-800 transition-colors cursor-pointer text-left"
            >
                <UserPlus className="w-4 h-4" />
                <span className="text-sm">Sign Up</span>

            </button>
          )}

          {/* Logout Option */}
          {showLogout && onLogout && (

              <div className="border-t border-gray-800">
            <button
              onClick={() => handleItemClick(onLogout)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors cursor-pointer text-left"
              >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
            )}
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default UserDropdown;
