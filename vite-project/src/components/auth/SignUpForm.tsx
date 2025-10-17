import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useState } from "react";
import { Button } from "../ui/button";
import { sendOTP, signUP } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hook";

interface SignupProps {
  btnName?: string;
}

function SignUpForm({ btnName }: SignupProps) {
  const [otp, setOtp] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>(""); // renamed from phoneNo
  const [email, setEmail] = useState<string>("");

  const dispatch = useAppDispatch();

  const handleSendOtp = () => {
    if (!email) return alert("Please enter your email");
    dispatch(sendOTP(email));
  };

  const handleSignUp = () => {
    if (!email || !otp) return alert("Please enter both email and OTP");
    dispatch(signUP({ fullName, email, phone, otp })); // ✅ sending phone correctly
  };

  return (
    <Dialog>
      <DialogTrigger className="">{btnName}</DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
      <DialogContent className="bg-darkgray text-white font-bold -p-[10px] h-[500px] border-none gap-0">
        <DialogHeader className=" flex items-center justify-center w-full h-[150px] border-gray-300 text-white border-b">
          <DialogTitle className="w-1/2 text-[32px] text-center">
            Log in to your Account
          </DialogTitle>
          Don't have an Account
        </DialogHeader>

        <div className="flex flex-col gap-10 w-full items-center justify-center h-[350px] ">
          <div className="flex flex-col gap-1 w-[300px]">
            <div>
              <p className="text-lightgray pl-1">FullName</p>
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <p className="text-lightgray pl-1">Email</p>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <p className="text-lightgray pl-1">Phone No.</p>
              <Input
                type="tel"
                placeholder="Phone No."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <div>
                <p className="text-lightgray pl-1">OTP</p>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button variant="default2" className="-mb-6" onClick={handleSendOtp}>
                Send Otp
              </Button>
            </div>
          </div>

          <div>
            <Button className="w-[200px]" onClick={handleSignUp}>
              Sign Up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SignUpForm;
