import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchAllEvents } from "@/store/eventSlice";
import EventCardContainer from "@/components/common/EventCardContainer";
import SearchBar from "@/components/common/SearchBar";
import GenreFilter from "@/components/common/GenreFilter";
import { Search, CalendarDays, Tags } from "lucide-react";

function Events() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const { events, loading, hasFetched } = useAppSelector(
    (state) => state.event
  );

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchAllEvents());
    }
  }, [dispatch, hasFetched]);

  const mappedEvents = useMemo(() => {
    return Array.isArray(events)
      ? events.map((event) => ({
          id: event._id,
          img1: event.image,
          title: event.title,
          description: event.description,
          startDate: event.startDate,
          genres: event.genreIds.map((g) => ({ id: g._id, name: g.name })),
          rating: 0,
          venue: event.venue,
          tickets:
            typeof event.minTicketPrice === "number"
              ? [{ price: event.minTicketPrice }]
              : [],
        }))
      : [];
  }, [events]);

  const allGenres = useMemo(() => {
    const genreMap = new Map<string, string>();
    mappedEvents.forEach((e) =>
      e.genres.forEach((g) => genreMap.set(g.id, g.name))
    );
    return Array.from(genreMap.entries()).map(([id, name]) => ({ id, name }));
  }, [mappedEvents]);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const date = dateQuery.trim();
    return mappedEvents.filter((e) => {
      const matchText =
        e.title.toLowerCase().includes(query) ||
        e.venue.toLowerCase().includes(query);
      const matchDate = date === "" || e.startDate.startsWith(date);
      const matchGenre =
        selectedGenre === "" ||
        e.genres.some(
          (g) => g.name.toLowerCase() === selectedGenre.toLowerCase()
        );

      return matchText && matchDate && matchGenre;
    });
  }, [mappedEvents, searchQuery, dateQuery, selectedGenre]);

  return (
    <div className="flex flex-col items-center gap-25 min-h-screen/2">
      <div className="flex flex-col items-center">
        <h1 className="navbarLinkActive text-[40px] font-bold max-w-[20ch] leading-tight">
            Explore Right Now !
          </h1>
      </div>
      <div className="flex justify-between gap-25 items-center w-full"><SearchBar
        label="Search by title or venue..."
        value={searchQuery}
        onChange={setSearchQuery}
        icon={<Search className="w-4 h-4" />}
        onFocus={() => {
          setDateQuery("");
          setSelectedGenre("");
        }}
      />

      <SearchBar
        label="dd-mm-yyyy"
        value={dateQuery}
        onChange={setDateQuery}
        type="date"
        onFocus={() => {
          setSearchQuery("");
          setSelectedGenre("");
        }}
        icon={<CalendarDays className="w-4 h-4" />}
      />

      <GenreFilter
        genres={allGenres}
        selected={selectedGenre}
        onChange={setSelectedGenre}
        icon={<Tags className="w-4 h-4" />}
        onFocus={() => {
          setSearchQuery("");
          setDateQuery("");
        }}
      /></div>

      {loading ? (
        <p className="text-white text-center">Loading events...</p>
      ) : (
        <EventCardContainer events={filteredEvents} limit={9} />
      )}
    </div>
  );
}

export default Events;
