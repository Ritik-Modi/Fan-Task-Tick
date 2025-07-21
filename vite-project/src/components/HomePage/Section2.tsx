import { Button } from "@/components/ui/button";
import img from "@/assets/section2.png";
import { useNavigate } from "react-router-dom";

function Section2() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/events')
    }
    
    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
            {/* Visualize Section */}
            <div className="flex flex-col lg:flex-row justify-center items-center min-h-[400px] lg:h-[480px] gap-8 lg:gap-12 mb-16">
                <div className="w-full lg:w-1/2 flex flex-col items-start gap-4 lg:gap-5 order-2 lg:order-1">
                    <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white">Visualize.</h1>
                    <p className="text-lightgray text-base lg:text-lg max-w-full lg:max-w-[500px] leading-relaxed">
                        Tell us all about your upcoming celebration! Whether it's the event
                        type, location, or guest count, we're all ears. Help us help you in
                        bringing your unique event to life.
                    </p>
                    <Button onClick={handleClick} className="w-full sm:w-auto">Learn More</Button>
                </div>
                <div className="w-full lg:w-1/2 grad-bg rounded-xl flex justify-center overflow-hidden order-1 lg:order-2">
                    <img src={img} alt="Visualize your event" className="w-full max-w-[420px] h-auto object-contain" />
                </div>
            </div>

            {/* Relax Section */}
            <div className="flex flex-col lg:flex-row justify-center items-center min-h-[400px] lg:h-[480px] gap-8 lg:gap-12 mb-16">
                <div className="w-full lg:w-1/2 grad-bg rounded-xl flex justify-center overflow-hidden order-1">
                    <img src={img} alt="Relax and let us handle it" className="w-full max-w-[420px] h-auto object-contain" />
                </div>
                <div className="w-full lg:w-1/2 flex flex-col items-start lg:items-end gap-4 lg:gap-5 order-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white">Relax.</h1>
                    <p className="text-lightgray text-base lg:text-lg max-w-full lg:max-w-[500px] leading-relaxed text-left lg:text-right">
                        Choose from our tailored suggestions of top-notch service providers
                        to bring your event to life. Let our algorithm handle the hard
                        work!
                    </p>
                    <Button onClick={handleClick} className="w-full sm:w-auto">Learn More</Button>
                </div>
            </div>

            {/* Celebrate Section */}
            <div className="flex flex-col lg:flex-row justify-center items-center min-h-[400px] lg:h-[480px] gap-8 lg:gap-12">
                <div className="w-full lg:w-1/2 flex flex-col items-start gap-4 lg:gap-5 order-2 lg:order-1">
                    <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white">Celebrate.</h1>
                    <p className="text-lightgray text-base lg:text-lg max-w-full lg:max-w-[500px] leading-relaxed">
                        Your event is flawlessly arranged to match your vision. Just sit
                        back, and experience the magic - we've got everything under
                        control!
                    </p>
                    <Button onClick={handleClick} className="w-full sm:w-auto">Learn More</Button>
                </div>
                <div className="w-full lg:w-1/2 grad-bg rounded-xl flex justify-center overflow-hidden order-1 lg:order-2">
                    <img src={img} alt="Celebrate your perfect event" className="w-full max-w-[420px] h-auto object-contain" />
                </div>
            </div>
        </div>
    );
}

export default Section2;
