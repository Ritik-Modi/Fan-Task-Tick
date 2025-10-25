import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchAllEvents } from "@/store/eventSlice";
import Section1 from "@/components/HomePage/Section1";
import EventCardContainer from "@/components/common/EventCardContainer";
import Section2 from "@/components/HomePage/Section2";
import ReviewSlider from "@/components/common/ReviewSlider";
import { getReviews } from "@/store/reviewSlice";
import { useBreakpoint } from "@/hooks/useBreakpoint";

function Home() {
  const dispatch = useAppDispatch();
  const { events, loading: eventLoading, hasFetched } = useAppSelector(
    (state) => state.event
  );
  const { reviews, loading: reviewLoading } = useAppSelector(
    (state) => state.review
  );
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    if (!hasFetched) dispatch(fetchAllEvents()); //TODO: make the the logic better like fetch only data that we need not the all data
    dispatch(getReviews());                       // TODO: same as above
  }, [dispatch, hasFetched]);

  const mappedEvents = Array.isArray(events)
    ? events.map((event) => ({
        id: event._id,
        img1: event.image,
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        genres: event.genreIds?.map((g) => ({ id: g._id, name: g.name })) || [],
        rating: 0,
        tickets: Array.isArray(event.tickets)
          ? event.tickets.map((t: any) => ({ price: t.price }))
          : [],
      }))
    : [];

  const mappedReviews = Array.isArray(reviews)
    ? reviews.map((review) => ({
        _id: review._id,
        review: review.review,
        rating: review.rating,
        userId: review.userId,
      }))
    : [];

  return (
    <main className="w-full bg-[#0f0f0f] text-white overflow-hidden">
      <Section1 />

      {/* === Events Section === */}
      <section className="w-full py-10 sm:py-14 md:py-20 px-4 sm:px-8 lg:px-16">
        {eventLoading ? (
          <p className="text-gray-400 text-center text-lg">Loading events...</p>
        ) : mappedEvents.length > 0 ? (
          <EventCardContainer events={mappedEvents} limit={isMobile ? 2 : 3} />
        ) : (
          <p className="text-gray-500 text-center text-lg">
            No events available right now.
          </p>
        )}
      </section>

      <Section2 />

      {/* === Reviews Section === */}
      <section className="w-full py-10 sm:py-14 md:py-20 px-4 sm:px-8 lg:px-16">
        {reviewLoading ? (
          <p className="text-gray-400 text-center text-lg">Loading reviews...</p>
        ) : mappedReviews.length > 0 ? (
          <ReviewSlider reviews={mappedReviews} />
        ) : (
          <p className="text-gray-500 text-center text-lg">
            No reviews yet. Be the first to share your experience!
          </p>
        )}
      </section>
    </main>
  );
}

export default Home;
