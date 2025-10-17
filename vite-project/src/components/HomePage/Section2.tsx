import { Button } from "@/components/ui/button";
import img from "@/assets/section2.png";
import { useNavigate } from "react-router-dom";

function Section2() {
  const navigate = useNavigate();
  const handleClick = () => navigate("/events");

  const sections = [
    {
      title: "Visualize.",
      text: "Tell us all about your upcoming celebration! Whether it's the event type, location, or guest count, we're all ears. Help us bring your unique event to life.",
      reverse: false,
    },
    {
      title: "Relax.",
      text: "Choose from our tailored suggestions of top-notch service providers to bring your event to life. Let our algorithm handle the hard work!",
      reverse: true,
    },
    {
      title: "Celebrate.",
      text: "Your event is flawlessly arranged to match your vision. Just sit back and experience the magic — we’ve got everything under control!",
      reverse: false,
    },
  ];

  return (
    <section className="w-full bg-[#0f0f0f] text-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-20 px-4 sm:px-8">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              sec.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-center justify-between gap-10`}
          >
            {/* Text */}
            <div
              className={`w-full lg:w-1/2 flex flex-col gap-5 ${
                sec.reverse ? "lg:items-end text-right" : "text-left"
              }`}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold">
                {sec.title}
              </h1>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-[500px]">
                {sec.text}
              </p>
              <Button
                onClick={handleClick}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>

            {/* Image */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src={img}
                alt={sec.title}
                className="w-full max-w-[420px] h-auto rounded-xl object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Section2;
