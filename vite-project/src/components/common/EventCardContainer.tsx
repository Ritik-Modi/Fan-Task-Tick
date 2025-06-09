import EventCard from "./EventCard";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Genre {
  id: string;
  name: string;
}

interface Ticket {
  price: number;
}

interface Event {
  id: string;
  img1: string;
  title: string;
  description: string;
  startDate: string;
  genres: Genre[];
  rating: number;
  tickets?: Ticket[];
}

interface EventCardContainerProps {
  events: Event[];
  limit?: number;
}

function EventCardContainer({ events, limit = 3 }: EventCardContainerProps) {
  const limitedEvents = limit ? events.slice(0, limit) : events;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/events");
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="grid grid-cols-3 gap-25">
        {limitedEvents.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>
      <Button onClick={handleClick}>
        View More <ArrowRightIcon />
      </Button>
    </div>
  );
}

export default EventCardContainer;
