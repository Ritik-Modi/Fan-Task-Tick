import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchAllEvents } from "@/store/eventSlice";
import EventCardContainer from "@/components/common/EventCardContainer";
import SearchBar from "@/components/common/SearchBar";
import GenreFilter from "@/components/common/GenreFilter";
import { Search, CalendarDays, Tags } from "lucide-react";
import { useBreakpoint } from "@/hooks/useBreakpoint";

function Events() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const { events, loading, hasFetched } = useAppSelector(
    (state) => state.event
  );
  const { isMobile } = useBreakpoint();

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
          genres: event.genreIds?.map((g) => ({ id: g._id, name: g.name })) || [],
          rating: 0,
          venue: event.venue,
          tickets: Array.isArray(event.tickets)
            ? event.tickets.map((t: any) => ({ price: t.price }))
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
    <main className="min-h-screen w-full bg-[#0f0f0f] text-white py-16 sm:py-20 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
          Explore Right Now!
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          Find events that match your vibe 🎶
        </p>
      </div>

      {/* === Filters Section === */}
      <section
        className={`flex ${
          isMobile ? "flex-col gap-4" : "flex-row flex-wrap gap-6"
        } items-center justify-center w-full mb-14`}
      >
        <SearchBar
          label="Search by title or venue..."
          value={searchQuery}
          onChange={setSearchQuery}
          icon={<Search className="w-4 h-4" />}
          onFocus={() => {
            setDateQuery("");
            setSelectedGenre("");
          }}
          className="w-full sm:w-[280px] md:w-[300px]"
        />

        <SearchBar
          label="Select date"
          value={dateQuery}
          onChange={setDateQuery}
          type="date"
          icon={<CalendarDays className="w-4 h-4" />}
          onFocus={() => {
            setSearchQuery("");
            setSelectedGenre("");
          }}
          className="w-full sm:w-[200px] md:w-[220px]"
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
          className="w-full sm:w-[220px] md:w-[240px]"
        />
      </section>

      {/* === Event Grid === */}
      <section className="w-full flex flex-col items-center justify-center">
        {loading ? (
          <p className="text-gray-400 text-center text-lg">Loading events...</p>
        ) : filteredEvents.length > 0 ? (
          <EventCardContainer events={filteredEvents} limit={9} />
        ) : (
          <p className="text-gray-500 text-center text-lg">
            No events match your filters.
          </p>
        )}
      </section>
    </main>
  );
}

export default Events;
