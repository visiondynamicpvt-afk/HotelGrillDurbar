import { Request, Response } from 'express';
import Content from '../../models/Content.js';

// @desc    Get content by section
// @route   GET /api/admin/content/:section
// @access  Private
export const getContentBySection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { section } = req.params;

    let content = await Content.findOne({ sectionName: section });

    // Create if doesn't exist
    if (!content) {
      content = await Content.create({
        sectionName: section,
        content: {},
        images: [],
      });
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

// @desc    Update content section
// @route   PUT /api/admin/content/:section
// @access  Private
export const updateContentSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { section } = req.params;
    const { content, images } = req.body;

    let contentDoc = await Content.findOne({ sectionName: section });

    if (!contentDoc) {
      contentDoc = await Content.create({
        sectionName: section,
        content: content || {},
        images: images || [],
      });
    } else {
      if (content) contentDoc.content = content;
      if (images) contentDoc.images = images;
      await contentDoc.save();
    }

    res.status(200).json({
      success: true,
      data: contentDoc,
      message: 'Content updated successfully',
    });
  } catch (error: any) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Upload content image
// @route   POST /api/admin/content/upload-image
// @access  Private
export const uploadContentImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const imageUrl = (req as any).fileUrl as string | undefined;

    if (!imageUrl) {
      res.status(400).json({
        success: false,
        message: 'Image is required',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        url: imageUrl,
      },
      message: 'Image uploaded successfully',
    });
  } catch (error: any) {
    console.error('Upload content image error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
