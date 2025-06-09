import Logo from '../../assets/LOGO.png';
import { navbarLinks } from '@/data/navbar_links';
import { NavLink } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAppSelector } from '@/store/hook.ts';
import DropDown from '../auth/DropDown';
import LoginForm from '../auth/LoginForm';
import SignUpForm from '../auth/SignUpForm';

function Navbar() {

  const token = useAppSelector((state) => state.auth.token);

  return (
    <div className="sticky top-0 z-50 bg-black text-white w-full h-[100px] flex items-center justify-between px-4">
      <div className="max-h-[100px] max-w-[100px]">
        <NavLink to={'/'}>
        <img src={Logo} alt="logo" className="h-full w-auto object-contain" />
        </NavLink>
      </div>

      <div>
        <ul className="flex gap-8 text-lg">
          {navbarLinks.map((link, index) => (
            <li
              key={index}
              className="navbarLink cursor-pointer"
            >
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  isActive ? 'navbarLinkActive' : ''
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
            <Button variant="default2" className="hidden md:block">
              <LoginForm btnName='Login' />
            </Button>
            <Button className="hidden md:block">
              <SignUpForm btnName='Sign Up'/>
            </Button>
          </>
        ) : (
          <DropDown />
        )}
      </div>
    </div>
  );
}

export default Navbar;
