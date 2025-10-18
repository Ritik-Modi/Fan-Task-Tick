import { Router } from 'express';
import {
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/Admin.controller.js';
import {
  addGenre,
  removeGenre
} from '../controllers/Genre.controller.js';
// import {
//   createTicketForEvent,
//   updateTicket,
//   deleteTicket
// } from '../controllers/Ticket.controller.js';
import { isAdmin, authMiddleware } from '../middlewares/Auth.middleware.js';
import ticketRoutes from './Ticket.route.js';

const router = Router();

router.post('/createEvent', authMiddleware, isAdmin, createEvent);
router.put('/updateEvent/:id', authMiddleware, isAdmin, updateEvent);
router.delete('/deleteEvent/:id', authMiddleware, isAdmin, deleteEvent);
router.post('/addGenre',    authMiddleware, isAdmin, addGenre);
router.delete('/removeGenre/:id', authMiddleware, isAdmin, removeGenre);
// router.post('/createTicketForEvent', authMiddleware, isAdmin, createTicketForEvent);
// router.post('/updateTicket',          authMiddleware, isAdmin, updateTicket);
// router.post('/deleteTicket',          authMiddleware, isAdmin, deleteTicket);
router.use("/:eventId/ticket", ticketRoutes);
export default router;
