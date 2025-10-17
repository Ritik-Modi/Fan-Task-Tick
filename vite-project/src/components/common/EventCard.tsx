import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface Genre {
  id: string;
  name: string;
}

interface Ticket {
  price: number;
}

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  img1: string;
  startDate: string;
  genres: Genre[];
  rating: number;
  tickets?: Ticket[];
}

function EventCard({
  id,
  img1,
  title,
  description,
  startDate,
  genres,
  rating,
  tickets = [],
}: EventCardProps) {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();

  const formattedDate = new Date(startDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const lowestPrice = tickets?.length
    ? Math.min(...tickets.map((t) => t.price))
    : null;

  return (
    <div
      onClick={() => navigate(`/events/${id}`)}
      className="cursor-pointer hover:scale-[1.02] transition-transform duration-200 w-full"
    >
      <Card className="bg-gray-900 text-white rounded-xl overflow-hidden shadow-md">
        <CardContent className="p-0">
          <div className="relative w-full">
            <img
              src={img1}
              alt={title}
              className={`w-full object-cover ${
                isMobile
                  ? "h-[180px]"
                  : isTablet
                  ? "h-[220px]"
                  : "h-[270px]"
              }`}
            />
            <div className="absolute top-2 left-2">
              <Badge variant="secondary">⭐ {rating}</Badge>
            </div>
          </div>

          <div className="bg-darkgray p-4 flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge key={genre.id} className="bg-gray-700 text-white">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-xl md:text-2xl font-semibold truncate">
                {title}
              </h3>
              <p
                className={`text-gray-400 ${
                  isMobile ? "text-sm line-clamp-2" : "text-base line-clamp-3"
                }`}
              >
                {description}
              </p>
            </div>

            <div className="flex flex-row justify-between items-center pt-2 border-t border-gray-800">
              <div className="text-lg font-semibold">
                {lowestPrice !== null ? `From ₹${lowestPrice}` : "No tickets"}
              </div>
              <div className="text-mint text-sm">{formattedDate}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EventCard;
