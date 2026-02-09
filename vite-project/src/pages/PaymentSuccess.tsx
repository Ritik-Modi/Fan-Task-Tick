import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-4">
      <div className="bg-[#1a1a1a] rounded-xl p-8 max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">Payment Successful</h1>
        <p className="text-gray-400">Your payment was completed. Your ticket will appear in your account.</p>
        <Link to="/dashboard">
          <Button className="bg-purple-600 hover:bg-purple-700 w-full">Go to Dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
