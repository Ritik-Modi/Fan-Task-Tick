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
import { useAppDispatch } from "@/store/hook.ts";
import { useNavigate } from "react-router-dom";

function DropDown() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    }

    const handleProfile = () => {
        navigate('/profile');
    }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="border rounded-full bg-white text-black p-2"> <PersonIcon/></DropdownMenuTrigger>
        <DropdownMenuContent className="text-white border-none bg-darkgray">
          <DropdownMenuItem onClick={handleProfile} className="flex flex-row items-center justify-center gap-2" ><PersonIcon/>Profile</DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white" />
          <DropdownMenuItem onClick={handleLogout} className="flex flex-row items-center justify-center gap-1" ><img src={Logout} alt="" className="w-[20px] h-[20px]" /> LogOut</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default DropDown;
