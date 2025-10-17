import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Button } from "@/components/ui/button";
import { sendOTP, signUP } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hook";
import { useNavigate } from "react-router-dom";

function SignUpForm() {
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) return alert("Please enter your email");
    await dispatch(sendOTP(email));
    alert("OTP sent successfully!");
  };

  const handleSignUp = async () => {
    if (!email || !otp || !fullName || !phone)
      return alert("Please fill all fields and enter OTP");

    const result = await dispatch(signUP({ fullName, email, phone, otp }));

    // ✅ if signup successful → redirect to login
    if (signUP.fulfilled.match(result)) {
      alert("Account created successfully! Please log in.");
      navigate("/login");
    } else {
      alert(result.payload || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-800">
        <div className="flex flex-col items-center justify-center py-10 border-b border-gray-700">
          <h1 className="text-3xl font-bold mb-2">Create your Account</h1>
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-purple-400 hover:underline">
              Log In
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-8 items-center py-10">
          <div className="flex flex-col gap-4 w-[80%]">
            <div>
              <p className="text-gray-400 pl-1 mb-1">Full Name</p>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <p className="text-gray-400 pl-1 mb-1">Email</p>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <p className="text-gray-400 pl-1 mb-1">Phone Number</p>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <p className="text-gray-400 pl-1 mb-1">OTP</p>
              <div className="flex items-center gap-2">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <Button
                  variant="default2"
                  className="-mb-5"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Button className="w-[200px]" onClick={handleSignUp}>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
