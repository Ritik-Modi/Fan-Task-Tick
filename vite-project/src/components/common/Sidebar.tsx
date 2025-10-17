import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
  LogOut,
} from "lucide-react";
import Logo from "../../assets/LOGO.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { useAppSelector } from "@/store/hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Menu items
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

function AppSidebar() {
  const user = useAppSelector((state) => state.auth.user);
  const { state } = useSidebar();
  
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
  };

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

  return (
    <Sidebar collapsible="offcanvas" className="border-l border-gray-800" side="left">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Logo */}
              <SidebarMenuItem className="h-24">
                <SidebarMenuButton asChild className="h-24">
                  <a href="/" className="flex items-center justify-center">
                    <img
                      src={Logo}
                      alt="logo"
                      className={`object-contain transition-all ${
                        state === "collapsed" ? "w-16 h-16" : "w-16 h-16"
                      }`}
                    />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Menu Items */}
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="text-white hover:bg-gray-800 rounded transition"
                >
                  <SidebarMenuButton asChild className="h-12">
                    <a href={item.url} className="text-lg">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-14 hover:bg-gray-800">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} alt={user?.fullName} />
                    <AvatarFallback className="bg-purple-600 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-sm font-medium truncate w-full">
                      {user?.fullName || "Guest User"}
                    </span>
                    <span className="text-xs text-gray-400 truncate w-full">
                      {user?.email || ""}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto w-4 h-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="w-56 bg-gray-900 border-gray-800"
              >
                <DropdownMenuItem
                  className="hover:bg-gray-800 cursor-pointer text-red-400 hover:text-red-300"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;