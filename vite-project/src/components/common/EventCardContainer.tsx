import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const eventsPerPage = limit;
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const paginatedEvents = events.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // optional: scroll to top
    }
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[25px]">
        {paginatedEvents.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>

      {/* === Bottom Control === */}
      {limit === 3 ? (
        <Button onClick={() => navigate("/events")}>
          View More <ArrowRightIcon className="ml-2" />
        </Button>
      ) : events.length > eventsPerPage ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}

export default EventCardContainer;
