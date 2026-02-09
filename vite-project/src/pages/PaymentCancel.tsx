import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PaymentCancel() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-4">
      <div className="bg-[#1a1a1a] rounded-xl p-8 max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">Payment Canceled</h1>
        <p className="text-gray-400">You canceled the checkout. You can try again anytime.</p>
        <Link to="/events">
          <Button className="bg-purple-600 hover:bg-purple-700 w-full">Back to Events</Button>
        </Link>
      </div>
    </main>
  );
}
