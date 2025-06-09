import React from "react";
import { Button } from "@/components/ui/button";
import img from "@/assets/section2.png";
import { useNavigate } from "react-router-dom";


function Section2() {
    const navigate = useNavigate();
    const handleClick = ()=>{
        navigate('/events')
    }
  return (
    <div className="w-[1200px]">
      <div className="flex justify-center items-center h-[480px]">
        <div className="w-[700px] flex flex-col items-start gap-5 ">
          <h1 className="text-[40px]">Visualize.</h1>
          <p className="max-w-[500px]">
            Tell us all about your upcoming celebration! Whether it's the event
            type, location, or guest count, we're all ears. Help us help you in
            bringing your unique event to life."
          </p>
          <Button onClick={handleClick}>Learn More</Button>
        </div>
        <div className="w-[500px] grad-bg rounded-xl flex justify-center overflow-hidden">
          <img src={img} alt="" className="w-[420px]" />
        </div>
      </div>
      {/*  */}
      <div className="flex justify-center items-center h-[480px]">
        <div className="w-[500px] grad-bg rounded-xl flex justify-center overflow-hidden">
          <img src={img} alt="" className="w-[420px]" />
        </div>
        <div className="w-[700px] flex flex-col items-end gap-5 ">
          <h1 className="text-[40px]">Relax.</h1>
          <p className="max-w-[500px]">
            Choose from our tailored suggestions of top-notch service providers
            to bring your event to life. Let our algorithm handle the hard
            work!"
          </p>
          <Button onClick={handleClick}>Learn More</Button>
        </div>
      </div>
      {/*  */}
      <div className="flex justify-center items-center h-[480px]">
        <div className="w-[700px] flex flex-col items-start gap-5 ">
          <h1 className="text-[40px]">Celebrate.</h1>
          <p className="max-w-[500px]">
            Your event is flawlessly arranged to match your vision. Just sit
            back, and experience the magic - we've got everything under
            control!"
          </p>
          <Button onClick={handleClick}>Learn More</Button>
        </div>
        <div className="w-[500px] grad-bg rounded-xl flex justify-center overflow-hidden">
          <img src={img} alt="" className="w-[420px]" />
        </div>
      </div>
    </div>
  );
}

export default Section2;
