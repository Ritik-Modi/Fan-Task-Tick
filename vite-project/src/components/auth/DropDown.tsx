import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PersonIcon} from "@radix-ui/react-icons"
import Logout from "@/assets/logOut.png";
import {logout} from "@/store/authSlice.ts";
import { useAppDispatch , useAppSelector } from "@/store/hook.ts";
import { useNavigate } from "react-router-dom";

function DropDown() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {user} = useAppSelector((state) => state.auth);

    const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    }

    const handleDashboard = () => {
        navigate('/dashboard');
    }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="border rounded-full bg-white text-black p-1"> <img src={user?.avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover" /></DropdownMenuTrigger>
        <DropdownMenuContent className="text-white border-none bg-darkgray">
          <DropdownMenuItem onClick={handleDashboard} className="flex flex-row items-center justify-center gap-2" ><PersonIcon/>Dashboard</DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white" />
          <DropdownMenuItem onClick={handleLogout} className="flex flex-row items-center justify-center gap-1" ><img src={Logout} alt="" className="w-[20px] h-[20px]" /> LogOut</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default DropDown;
