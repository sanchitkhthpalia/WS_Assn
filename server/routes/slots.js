const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Generate slots for the next 7 days
const generateSlots = async () => {
  const slots = [];
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Generate slots for next 7 days
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      continue;
    }
    
    // Generate 30-minute slots from 9:00 to 17:00
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startAt = new Date(currentDate);
        startAt.setHours(hour, minute, 0, 0);
        
        const endAt = new Date(startAt);
        endAt.setMinutes(endAt.getMinutes() + 30);
        
        // Skip slots in the past
        if (startAt <= now) {
          continue;
        }
        
        slots.push({
          startAt,
          endAt
        });
      }
    }
  }
  
  return slots;
};

// GET /api/slots?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/slots', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    // Generate or get existing slots
    let slots = await prisma.slot.findMany({
      where: {
        startAt: {
          gte: from ? new Date(from) : new Date(),
          lte: to ? new Date(to) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        booking: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        startAt: 'asc'
      }
    });
    
    // If no slots exist, generate them
    if (slots.length === 0) {
      const newSlots = await generateSlots();
      
      // Create slots in database
      await prisma.slot.createMany({
        data: newSlots
      });
      
      // Fetch created slots with booking info
      slots = await prisma.slot.findMany({
        where: {
          startAt: {
            gte: from ? new Date(from) : new Date(),
            lte: to ? new Date(to) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          booking: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          startAt: 'asc'
        }
      });
    }
    
    // Format response
    const formattedSlots = slots.map(slot => ({
      id: slot.id,
      startAt: slot.startAt,
      endAt: slot.endAt,
      isBooked: !!slot.booking,
      booking: slot.booking ? {
        id: slot.booking.id,
        userId: slot.booking.userId,
        user: slot.booking.user
      } : null
    }));
    
    res.json(formattedSlots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch slots'
      }
    });
  }
});

module.exports = router;
