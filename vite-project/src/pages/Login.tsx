import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Button } from "@/components/ui/button";
import { sendOTP, login } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hook";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) return alert("Please enter your email");
    await dispatch(sendOTP(email));
    alert("OTP sent successfully!");
  };

  const handleLogin = async () => {
    if (!email || !otp) return alert("Please enter both email and OTP");

    const result = await dispatch(login({ email, otp }));

    // ✅ check if login successful
    if (login.fulfilled.match(result)) {
      navigate("/"); // redirect to home
    } else {
      alert(result.payload || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-800">
        <div className="flex flex-col items-center justify-center py-10 border-b border-gray-700">
          <h1 className="text-3xl font-bold mb-2">Log in to your Account</h1>
          <p className="text-gray-400 text-sm">
            Don’t have an account?{" "}
            <a href="/signup" className="text-purple-400 hover:underline">
              Sign Up
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-8 items-center py-10">
          <div className="flex flex-col gap-4 w-[80%]">
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
            <Button className="w-[200px]" onClick={handleLogin}>
              Log In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
