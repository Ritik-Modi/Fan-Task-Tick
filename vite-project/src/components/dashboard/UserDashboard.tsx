import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { fetchUserTickets } from '@/store/userTicketSlice';
import { Separator } from "@/components/ui/separator"

function UserDashboard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { tickets, loading } = useAppSelector((state) => state.userTicket);

  useEffect(() => {
    dispatch(fetchUserTickets());
  }, [dispatch]);

  return (
    <div className='flex flex-col items-center justify-center gap-4 mt-6 w-full px-2 sm:px-4'>
      {/* User Info Section */}
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-center bg-darkgray w-full max-w-2xl rounded-lg p-4'>
        <div>
          <img
            src={user?.avatar || '/assets/UserImage/default.svg'}
            onError={(e) => (e.currentTarget.src = '/assets/UserImage/default.svg')}
            alt='avatar'
            className='w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover border border-mint'
          />
        </div>
        <Separator className="hidden sm:block" />
        <div className='text-white flex flex-col gap-1 text-center sm:text-left'>
          <h1 className="font-bold text-lg">{user?.fullName}</h1>
          <h1>Email: {user?.email}</h1>
          <h1>Phone: {user?.phone}</h1>
          <h1>Account: {user?.accountType}</h1>
        </div>
      </div>

      {/* Tickets Section */}
      <div className='w-full max-w-2xl bg-darkgray p-4 rounded-lg text-white'>
        <h2 className='text-xl font-semibold mb-4 text-center sm:text-left'>My Tickets</h2>

        {loading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <ul className='space-y-4'>
            {tickets.map((ticket) => (
              <li key={ticket._id} className='border border-white/20 p-4 rounded-md bg-gray-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
                <div>
                  <h3 className='text-lg font-bold'>{ticket.ticketId.title}</h3>
                  <p className='text-sm'>Event: {ticket.ticketId.eventId.title}</p>
                  <p className='text-sm'>Date: {new Date(ticket.ticketId.eventId.startDate).toLocaleString()}</p>
                </div>
                <div className='text-right'>
                  <p className='font-semibold text-mint'>₹{ticket.ticketId.price}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
