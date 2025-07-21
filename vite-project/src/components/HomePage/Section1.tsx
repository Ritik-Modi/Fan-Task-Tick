import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import img from "@/assets/HomePage1.png";

function Section1() {
  return (
    <div className="flex flex-col items-center gap-10 w-full px-2 sm:px-4 md:gap-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 p-4 sm:p-8 text-white w-full max-w-6xl">
        <div className="flex flex-col items-start justify-center gap-4 w-full md:w-1/2">
          <h1 className="navbarLinkActive text-3xl sm:text-4xl md:text-[48px] font-bold max-w-[20ch] leading-tight">
            Discover the Dopest Events in Your City.
          </h1>
          <p className="text-lightgray max-w-[35ch] leading-relaxed text-base sm:text-lg">
            From concerts to workshops, find what’s happening around you — fast.
          </p>
          <Button className="w-full sm:w-auto">
            Start Exploring <ArrowRightIcon />
          </Button>
        </div>
        <div className="flex justify-center items-center w-full md:w-1/2 mt-6 md:mt-0">
          <img src={img} alt="img" className="w-full max-w-xs sm:max-w-md md:max-w-lg rounded-xl object-cover" />
        </div>
      </div>

      <div className="flex flex-col items-center w-full px-2">
        <h1 className="navbarLinkActive text-2xl sm:text-3xl md:text-[40px] font-bold max-w-[20ch] leading-tight text-center">
          Tranding Right Now !
        </h1>
        <p className="text-lightgray max-w-[35ch] leading-relaxed text-center text-base sm:text-lg">
          What Everyone's Talking Right Now.
        </p>
      </div>
    </div>
  );
}

export default Section1;
