import { Request, Response } from 'express';
import Room from '../models/Room.js';

// @desc    Get all available rooms
// @route   GET /api/rooms
// @access  Public
export const getAvailableRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find({ isAvailable: true });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error: any) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req: Request, res: Response): Promise<void> => {
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

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error: any) {
    console.error('Get room by id error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
