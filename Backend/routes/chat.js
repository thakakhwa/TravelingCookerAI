import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import TravelAI from '../services/travelAI.js';

const router = express.Router();
const prisma = new PrismaClient();
const travelAI = new TravelAI();

// Get all chat sessions for user
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1 // Get the last message for preview
        },
        _count: {
          select: { messages: true }
        }
      }
    });

    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
});

// Get specific chat session with all messages
router.get('/sessions/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.chatSession.findFirst({
      where: { 
        id: sessionId,
        userId: req.user.id 
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to fetch chat session' });
  }
});

// Create new chat session
router.post('/sessions', [
  authenticateToken,
  body('title').optional().isLength({ min: 1, max: 100 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { title } = req.body;
    
    const session = await prisma.chatSession.create({
      data: {
        title: title || `New Chat - ${new Date().toLocaleDateString()}`,
        userId: req.user.id
      }
    });

    res.status(201).json({ 
      message: 'Chat session created',
      session 
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// Add message to chat session with AI response
router.post('/sessions/:sessionId/messages', [
  authenticateToken,
  body('content').isLength({ min: 1 }).trim(),
  body('sender').isIn(['user', 'ai']).optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { sessionId } = req.params;
    const { content, sender = 'user' } = req.body;

    // Verify session belongs to user
    const session = await prisma.chatSession.findFirst({
      where: { 
        id: sessionId,
        userId: req.user.id 
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Create user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        content,
        sender: 'user',
        sessionId
      }
    });

    let aiMessage = null;
    let travelData = null;

    // Generate AI response for user messages
    if (sender === 'user') {
      try {
        const aiResult = await travelAI.processQuery(req.user.id, sessionId, content);
        
        // Create AI response message
        aiMessage = await prisma.chatMessage.create({
          data: {
            content: aiResult.response,
            sender: 'ai',
            sessionId
          }
        });

        travelData = aiResult.data;
      } catch (aiError) {
        console.error('AI processing error:', aiError);
        
        // Create fallback AI message
        aiMessage = await prisma.chatMessage.create({
          data: {
            content: "I'm having trouble processing your request right now. Could you please try rephrasing your question?",
            sender: 'ai',
            sessionId
          }
        });
      }
    }

    // Update session's updatedAt timestamp
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() }
    });

    res.status(201).json({ 
      message: 'Message processed',
      data: {
        userMessage,
        aiMessage,
        travelData
      }
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Update chat session title
router.patch('/sessions/:sessionId', [
  authenticateToken,
  body('title').isLength({ min: 1, max: 100 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { sessionId } = req.params;
    const { title } = req.body;

    const session = await prisma.chatSession.updateMany({
      where: { 
        id: sessionId,
        userId: req.user.id 
      },
      data: { title }
    });

    if (session.count === 0) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({ message: 'Session title updated' });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Delete chat session
router.delete('/sessions/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.chatSession.deleteMany({
      where: { 
        id: sessionId,
        userId: req.user.id 
      }
    });

    if (session.count === 0) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({ message: 'Chat session deleted' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Public travel planning endpoint (no auth required)
router.post('/public/travel-plan', [
  body('destination').isLength({ min: 1 }).trim(),
  body('origin').optional().trim(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('budget').optional().isNumeric(),
  body('travelers').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const {
      destination,
      origin = 'Amman',
      startDate,
      endDate,
      budget = 1000,
      travelers = 2,
      travelStyle,
      activities,
      accommodationType
    } = req.body;

    // Create a travel planning query message
    const planningQuery = `Plan a trip to ${destination} from ${origin} for ${travelers} travelers with a budget of ${budget} JOD. ${travelStyle ? `Travel style: ${travelStyle}. ` : ''}${activities ? `Interested in: ${activities}. ` : ''}${accommodationType ? `Preferred accommodation: ${accommodationType}.` : ''}`;

    // Process with AI (use demo user ID if not authenticated)
    const userId = req.user?.id || 'demo-user';
    const aiResult = await travelAI.processQuery(userId, `temp-${Date.now()}`, planningQuery);

    res.json({
      success: true,
      plan: aiResult.data,
      recommendations: aiResult.response,
      searchParams: {
        destination,
        origin,
        startDate,
        endDate,
        budget,
        travelers
      }
    });

  } catch (error) {
    console.error('Travel planning error:', error);
    res.status(500).json({ error: 'Failed to create travel plan' });
  }
});

export default router; 