import ReviewCard from "./ReviewCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Review {
  _id: string ,
  review?: string
  rating?: number;
  userId: {
    _id: string;
    fullName: string;
  };
}

interface ReviewSliderProps {
  reviews: Review[];
}

export default function ReviewSlider({ reviews }: ReviewSliderProps) {
  const MAX_SLIDES = 3;
  const REVIEWS_PER_SLIDE = 3;
  const limitedReviews = reviews.slice(0, MAX_SLIDES * REVIEWS_PER_SLIDE); // max 9

  const reviewSlides: Review[][] = [];

  for (let i = 0; i < limitedReviews.length; i += REVIEWS_PER_SLIDE) {
    reviewSlides.push(limitedReviews.slice(i, i + REVIEWS_PER_SLIDE));
  }

  return (
    <div className="overflow-x-hidden px-4">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="navbarLinkActive text-[40px] font-bold max-w-[20ch] leading-tight">
          Trending Right Now!
        </h1>
        <p className="text-lightgray max-w-[35ch] leading-relaxed">
          What Everyone's Talking Right Now.
        </p>
      </div>

      <Carousel>
        <CarouselContent>
          {reviewSlides.map((group, index) => (
            <CarouselItem key={index} className="w-full">
              <div className="flex flex-wrap justify-center gap-16 px-4">
                {group.map((review, i) => (
                  <ReviewCard key={i} {...review} />
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext className="bg-white"/>
      </Carousel>
    </div>
  );
}
