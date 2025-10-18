

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const withParams = (endpoint: string, params: Record<string, string | number>): string => {
  return Object.entries(params).reduce(
    (acc, [key, val]) => acc.replace(`:${key}`, encodeURIComponent(val.toString())),
    endpoint
  );
};

// --------- Auth Endpoints ---------
export const authEndpoints = {
  signUp: `${BASE_URL}/auth/signUp`,
  login: `${BASE_URL}/auth/login`,
  logout: `${BASE_URL}/auth/logout`,
  sendOtp: `${BASE_URL}/auth/sendOtp`,
};

// --------- Admin Endpoints ---------
export const adminEndpoints = {
  createEvent: `${BASE_URL}/admin/createEvent`,
  updateEvent: (id: string) => withParams(`${BASE_URL}/admin/updateEvent/:id`, { id }),
  deleteEvent: (id: string) => withParams(`${BASE_URL}/admin/deleteEvent/:id`, { id }),
  addGenre: `${BASE_URL}/admin/addGenre`,
  removeGenre: (id: string) => withParams(`${BASE_URL}/admin/removeGenre/:id`, { id }),
};

// --------- Genre Endpoints ---------
export const genreEndpoints = {
  getAllGenres: `${BASE_URL}/genre/genres`,
   createGenre: "/api/genre/addGenre", 
};

// --------- User Endpoints ---------
export const userEndpoints = {
  getUserProfile: `${BASE_URL}/user/getUserProfile`,
  createUserProfile: `${BASE_URL}/user/createUserProfile`,
  getUserEvents: `${BASE_URL}/user/getUserEvents`,
  getPurchesedTickets: `${BASE_URL}/user/getPurchesedTickets`,
};

// --------- Event Endpoints ---------
export const eventEndpoints = {
  getAllEvents: `${BASE_URL}/event/getAllEvents`,
  getEventById: (id: string) => withParams(`${BASE_URL}/event/getEventById/:id`, { id }),
  getEventByGenre: (genreId: string) => withParams(`${BASE_URL}/event/getEventByGenre/:genreId`, { genreId }),
  getEventByVenue: (venue: string) => withParams(`${BASE_URL}/event/getEventByVenue/:venue`, { venue }),
  getEventByDate: `${BASE_URL}/event/getEventByDate`,
};

// --------- Ticket Endpoints ---------
// --------- Ticket Endpoints (Backend: /api/v1/event/:eventId/ticket) ---------
export const ticketEndpoints = {
  getTicketsByEvent: (eventId: string) =>
    `${BASE_URL}/event/${eventId}/ticket/getTicketsByEvent`,

  createTicket: (eventId: string) =>
    `${BASE_URL}/event/${eventId}/ticket/create-ticket`,

  updateTicket: (eventId: string, ticketId: string) =>
    `${BASE_URL}/event/${eventId}/ticket/updateTicket/${ticketId}`,

  deleteTicket: (eventId: string, ticketId: string) =>
    `${BASE_URL}/event/${eventId}/ticket/deleteTicket/${ticketId}`,
};


// --------- Review Endpoints ---------
export const reviewEndpoints = {
  getReview: `${BASE_URL}/review/getReview`,
  createReview: `${BASE_URL}/review/create-review`,
  deleteReview: ( reviewId: string) =>
    withParams(`${BASE_URL}/event/:eventId/review/deleteReview/:reviewId`, { reviewId }),
};

// --------- Payment Endpoints ---------
export const paymentEndpoints = {
  createPayment: (ticketId: string) =>
    withParams(`${BASE_URL}/ticket/:ticketId/payment`, { ticketId }),
  verifyPayment: (ticketId: string) =>
    withParams(`${BASE_URL}/ticket/:ticketId/payment/verify`, { ticketId }),
  markTicketAsUsed: (ticketId: string, userTicketId: string) =>
    withParams(`${BASE_URL}/ticket/:ticketId/payment/:userTicketId/used`, { ticketId, userTicketId }),
};
