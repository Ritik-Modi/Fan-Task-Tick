import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useBreakpoint } from "@/hooks/useBreakpoint";

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
  limit?: number; // how many cards to show per "page" or "section"
}

function EventCardContainer({ events, limit = 3 }: EventCardContainerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();

  const eventsPerPage = limit;
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const paginatedEvents = events.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      {/* === Event Grid === */}
      <div
        className={`grid gap-6 sm:gap-8 w-full justify-items-center ${
          isMobile
            ? "grid-cols-1"
            : isTablet
            ? "grid-cols-2"
            : "grid-cols-3"
        }`}
      >
        {paginatedEvents.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>

      {/* === Bottom Control Section === */}
      <div className="flex justify-center items-center w-full">
        {/* When using limit = 3 (like homepage section) */}
        {limit === 3 ? (
          <Button
            onClick={() => navigate("/events")}
            className="flex items-center gap-2"
          >
            View More <ArrowRightIcon className="w-4 h-4" />
          </Button>
        ) : (
          // Pagination only if there are multiple pages
          events.length > eventsPerPage && (
            <Pagination>
              <PaginationContent className="flex flex-wrap justify-center gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )
        )}
      </div>
    </div>
  );
}

export default EventCardContainer;
