const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/book - Book a slot
router.post('/book', authenticateToken, async (req, res) => {
  const { slotId } = req.body;
  const userId = req.user.id;

  // Validation
  if (!slotId) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Slot ID is required'
      }
    });
  }

  try {
    // Check if slot exists and is available
    const slot = await prisma.slot.findUnique({
      where: { id: parseInt(slotId) },
      include: { booking: true }
    });

    if (!slot) {
      return res.status(404).json({
        error: {
          code: 'SLOT_NOT_FOUND',
          message: 'Slot not found'
        }
      });
    }

    if (slot.booking) {
      return res.status(409).json({
        error: {
          code: 'SLOT_TAKEN',
          message: 'This slot is already booked'
        }
      });
    }

    // Check if slot is in the past
    if (slot.startAt <= new Date()) {
      return res.status(400).json({
        error: {
          code: 'SLOT_EXPIRED',
          message: 'Cannot book slots in the past'
        }
      });
    }

    // Create booking with transaction to prevent race conditions
    const booking = await prisma.$transaction(async (tx) => {
      // Double-check slot availability within transaction
      const currentSlot = await tx.slot.findUnique({
        where: { id: parseInt(slotId) },
        include: { booking: true }
      });

      if (currentSlot.booking) {
        throw new Error('SLOT_TAKEN');
      }

      // Create the booking
      return await tx.booking.create({
        data: {
          userId,
          slotId: parseInt(slotId)
        },
        include: {
          slot: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    });

    res.status(201).json({
      id: booking.id,
      slotId: booking.slotId,
      userId: booking.userId,
      slot: {
        id: booking.slot.id,
        startAt: booking.slot.startAt,
        endAt: booking.slot.endAt
      },
      user: booking.user,
      createdAt: booking.createdAt
    });
  } catch (error) {
    console.error('Booking error:', error);
    
    if (error.message === 'SLOT_TAKEN') {
      return res.status(409).json({
        error: {
          code: 'SLOT_TAKEN',
          message: 'This slot is already booked'
        }
      });
    }

    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create booking'
      }
    });
  }
});

// GET /api/my-bookings - Get user's bookings (patient only)
router.get('/my-bookings', authenticateToken, requireRole('PATIENT'), async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        slot: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        slot: {
          startAt: 'asc'
        }
      }
    });

    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      slotId: booking.slotId,
      slot: {
        id: booking.slot.id,
        startAt: booking.slot.startAt,
        endAt: booking.slot.endAt
      },
      user: booking.user,
      createdAt: booking.createdAt
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch bookings'
      }
    });
  }
});

// GET /api/all-bookings - Get all bookings (admin only)
router.get('/all-bookings', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        slot: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        slot: {
          startAt: 'asc'
        }
      }
    });

    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      slotId: booking.slotId,
      slot: {
        id: booking.slot.id,
        startAt: booking.slot.startAt,
        endAt: booking.slot.endAt
      },
      user: booking.user,
      createdAt: booking.createdAt
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch bookings'
      }
    });
  }
});

module.exports = router;
