import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchAllEvents } from "@/store/eventSlice";
import Section1 from "@/components/HomePage/Section1";
import EventCardContainer from "@/components/common/EventCardContainer";
import Section2 from "@/components/HomePage/Section2";
import ReviewSlider from "@/components/common/ReviewSlider";
import {getReviews} from '@/store/reviewSlice'


function Home() {
  const dispatch = useAppDispatch();
  const { events, loading : eventLoading } = useAppSelector((state) => state.event);
  const { reviews , loading: reviewLoading} = useAppSelector((state)=> state.review)

  useEffect(() => {
    dispatch(fetchAllEvents()).then((action) => {
      console.log("feched Events" ,action);
    dispatch(getReviews()).then((action)=>{
      console.log("fetched Review :" , action)
    })
    });
  }, [dispatch]);

  const mappedEvents = Array.isArray(events)
    ? events.map((event) => ({
        id: event._id,
        img1: event.image,
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        genres: event.genreIds.map((g) => ({ id: g._id, name: g.name })),
        rating: 0,
        tickets:
          typeof event.minTicketPrice === "number"
            ? [{ price: event.minTicketPrice }]
            : [],
      }))
    : [];
    
  const mappedReviews = Array.isArray(reviews)
      ? reviews.map((review) =>({
        _id: review._id,
        review: review.review,
        rating : review.rating,
        userId : review.userId


      })) : [];

  return (
    <>
      <Section1 />
      {eventLoading ? (
        <p className="text-white text-center">Loading events...</p>
      ) : (
        <EventCardContainer events={mappedEvents} />
      )}
      <Section2 />
      {reviewLoading ?(
        <p className="text-white text-center">Loading Reviews.....</p>
      ) :(

        <ReviewSlider reviews={mappedReviews} />
      )

      }
    </>
  );
}

export default Home;
