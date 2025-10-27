const { PrismaClient } = require('@prisma/client');
const { generateCaption } = require('../services/aiService');

const prisma = new PrismaClient();

exports.createCaption = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Generate caption using AI
    const generatedCaption = await generateCaption(req.file.path);

    // Save to database
    const caption = await prisma.caption.create({
      data: {
        userId: req.user.id,
        imageUrl,
        caption: generatedCaption
      }
    });

    res.status(201).json({
      message: 'Caption generated successfully',
      caption
    });
  } catch (error) {
    next(error);
  }
};

exports.getCaptions = async (req, res, next) => {
  try {
    const captions = await prisma.caption.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({ captions });
  } catch (error) {
    next(error);
  }
};

exports.getCaption = async (req, res, next) => {
  try {
    const { id } = req.params;

    const caption = await prisma.caption.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!caption) {
      return res.status(404).json({ error: 'Caption not found' });
    }

    res.json({ caption });
  } catch (error) {
    next(error);
  }
};

exports.deleteCaption = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.caption.delete({
      where: {
        id,
        userId: req.user.id
      }
    });

    res.json({ message: 'Caption deleted successfully' });
  } catch (error) {
    next(error);
  }
};