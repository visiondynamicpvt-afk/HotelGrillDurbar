import { Request, Response } from 'express';
import Content from '../models/Content.js';

// @desc    Get content by section
// @route   GET /api/content/:section
// @access  Public
export const getContentBySection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { section } = req.params;

    const content = await Content.findOne({ sectionName: section });

    if (!content) {
      res.status(404).json({
        success: false,
        message: 'Content section not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error: any) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
