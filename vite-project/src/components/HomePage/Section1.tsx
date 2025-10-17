import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import img from "@/assets/HomePage1.png";
import { useNavigate } from "react-router-dom";
import { useBreakpoint } from "@/hooks/useBreakpoint";

function Section1() {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();

  return (
    <section className="w-full bg-[#0f0f0f] text-white py-14 sm:py-20 md:py-28 flex flex-col items-center overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 max-w-6xl px-4 sm:px-8">
        {/* Text Block */}
        <div className="flex flex-col gap-5 md:w-1/2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Discover the Dopest Events in Your City.
          </h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-md">
            From concerts to workshops, find what’s happening around you — fast.
          </p>
          <Button
            onClick={() => navigate("/events")}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
          >
            Start Exploring
            <ArrowRightIcon className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Image Block */}
        <div className="flex justify-center items-center md:w-1/2">
          <img
            src={img}
            alt="Event illustration"
            className={`rounded-xl object-cover ${
              isMobile
                ? "max-w-xs"
                : isTablet
                ? "max-w-md"
                : "max-w-lg"
            }`}
          />
        </div>
      </div>

      {/* Trending Section */}
      <div className="mt-14 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Trending Right Now 🔥
        </h2>
        <p className="text-gray-400 text-base sm:text-lg">
          What everyone’s talking about today.
        </p>
      </div>
    </section>
  );
}

export default Section1;
