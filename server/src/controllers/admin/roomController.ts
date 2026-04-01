import { Request, Response } from 'express';
import Room from '../../models/Room.js';

// @desc    Get all rooms
// @route   GET /api/admin/rooms
// @access  Private
export const getAllRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error: any) {
    console.error('Get all rooms error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create room
// @route   POST /api/admin/rooms
// @access  Private
export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomType, pricePerPerson, features, maxOccupancy, description } = req.body;

    if (!roomType || !pricePerPerson || !maxOccupancy) {
      res.status(400).json({
        success: false,
        message: 'Please provide roomType, pricePerPerson, and maxOccupancy',
      });
      return;
    }

    const room = await Room.create({
      roomType,
      pricePerPerson,
      features: features || [],
      maxOccupancy,
      description,
      isAvailable: true,
      images: [],
    });

    res.status(201).json({
      success: true,
      data: room,
      message: 'Room created successfully',
    });
  } catch (error: any) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update room
// @route   PUT /api/admin/rooms/:id
// @access  Private
export const updateRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const room = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Room not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: room,
      message: 'Room updated successfully',
    });
  } catch (error: any) {
    console.error('Update room error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/admin/rooms/:id
// @access  Private
export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Room not found',
      });
      return;
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete room error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Toggle room availability
// @route   PUT /api/admin/rooms/:id/availability
// @access  Private
export const toggleRoomAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Room not found',
      });
      return;
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    res.status(200).json({
      success: true,
      data: room,
      message: `Room ${room.isAvailable ? 'enabled' : 'disabled'} successfully`,
    });
  } catch (error: any) {
    console.error('Toggle room availability error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Upload room images
// @route   POST /api/admin/rooms/:id/images
// @access  Private
export const uploadRoomImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const imageUrls = (req as any).fileUrls as string[] | undefined;

    if (!imageUrls || imageUrls.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please upload at least one image',
      });
      return;
    }

    const room = await Room.findById(id);

    if (!room) {
      res.status(404).json({
        success: false,
        message: 'Room not found',
      });
      return;
    }

    room.images = [...room.images, ...imageUrls];
    await room.save();

    res.status(200).json({
      success: true,
      data: room,
      message: 'Images uploaded successfully',
    });
  } catch (error: any) {
    console.error('Upload room images error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
