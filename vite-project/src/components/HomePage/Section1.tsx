import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import img from "@/assets/HomePage1.png";

function Section1() {
  return (
    <div className="flex flex-col items-center gap-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-8 text-white">
        <div className="flex flex-col items-start justify-center gap-4 md:w-1/2 w-1/2">
          <h1 className="navbarLinkActive text-[48px] font-bold max-w-[20ch] leading-tight">
            Discover the Dopest Events in Your City.
          </h1>
          <p className="text-lightgray max-w-[35ch] leading-relaxed">
            From concerts to workshops, find what’s happening around you — fast.
          </p>
          <Button>
            Start Exploring <ArrowRightIcon />
          </Button>
        </div>
        <div className="flex justify-center items-center md:w-1/2 w-1/2 ">
          <img src={img} alt="img" />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h1 className="navbarLinkActive text-[40px] font-bold max-w-[20ch] leading-tight">
            Tranding Right Now !
          </h1>
          <p className="text-lightgray max-w-[35ch] leading-relaxed">
            What Everyone's Talking Right Now.
          </p>
      </div>
    </div>
  );
}

export default Section1;
