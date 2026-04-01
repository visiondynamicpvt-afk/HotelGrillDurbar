import { useEffect, useState } from 'react';
import { adminApi, Room } from '@/lib/api';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import GlassCard from '@/components/UI/GlassCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    roomType: '',
    pricePerPerson: '',
    maxOccupancy: '',
    description: '',
    features: '',
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await adminApi.getAllRooms();
      setRooms(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRoom(null);
    setFormData({
      roomType: '',
      pricePerPerson: '',
      maxOccupancy: '',
      description: '',
      features: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      roomType: room.roomType,
      pricePerPerson: room.pricePerPerson.toString(),
      maxOccupancy: room.maxOccupancy.toString(),
      description: room.description || '',
      features: room.features.join(', '),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const roomData = {
        roomType: formData.roomType,
        pricePerPerson: parseFloat(formData.pricePerPerson),
        maxOccupancy: parseInt(formData.maxOccupancy),
        description: formData.description,
        features: formData.features.split(',').map((f) => f.trim()).filter(Boolean),
      };

      if (editingRoom) {
        await adminApi.updateRoom(editingRoom._id, roomData);
        toast.success('Room updated successfully');
      } else {
        await adminApi.createRoom(roomData);
        toast.success('Room created successfully');
      }

      setIsDialogOpen(false);
      loadRooms();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save room');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      await adminApi.deleteRoom(id);
      toast.success('Room deleted successfully');
      loadRooms();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete room');
    }
  };

  const handleToggleAvailability = async (room: Room) => {
    try {
      await adminApi.toggleRoomAvailability(room._id);
      toast.success(`Room ${room.isAvailable ? 'disabled' : 'enabled'}`);
      loadRooms();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update room');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display text-pale-white mb-2">Rooms Management</h1>
          <p className="text-muted-foreground">Manage hotel rooms and pricing ({rooms.length} rooms)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="bg-jade-bright hover:bg-jade-deep">
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-charcoal-deep border-border text-pale-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">
                {editingRoom ? 'Edit Room' : 'Create New Room'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roomType">Room Type *</Label>
                  <Input
                    id="roomType"
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    className="bg-charcoal border-border text-pale-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerPerson">Price Per Person (NPR) *</Label>
                  <Input
                    id="pricePerPerson"
                    type="number"
                    value={formData.pricePerPerson}
                    onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value })}
                    className="bg-charcoal border-border text-pale-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maxOccupancy">Max Occupancy *</Label>
                  <Input
                    id="maxOccupancy"
                    type="number"
                    value={formData.maxOccupancy}
                    onChange={(e) => setFormData({ ...formData, maxOccupancy: e.target.value })}
                    className="bg-charcoal border-border text-pale-white"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-charcoal border-border text-pale-white"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="AC, WiFi, TV, etc."
                  className="bg-charcoal border-border text-pale-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-jade-bright hover:bg-jade-deep">
                  {editingRoom ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <GlassCard className="p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin">
              <div className="w-8 h-8 border-4 border-jade-bright border-t-transparent rounded-full"></div>
            </div>
            <p className="text-muted-foreground">Loading rooms...</p>
          </div>
        </GlassCard>
      ) : rooms.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-muted-foreground mb-6 text-lg">No rooms found. Create your first room to get started.</p>
          <Button onClick={handleCreate} className="bg-jade-bright hover:bg-jade-deep">
            <Plus className="mr-2 h-4 w-4" />
            Create First Room
          </Button>
        </GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <GlassCard key={room._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-display text-pale-white mb-1">{room.roomType || 'Room'}</h3>
                  <p className="text-jade-bright font-semibold">
                    NPR {room.pricePerPerson ? room.pricePerPerson.toLocaleString() : '0'}/person
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleAvailability(room)}
                  className={room.isAvailable ? 'text-green-400' : 'text-red-400'}
                >
                  {room.isAvailable ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>

              {room.description && (
                <p className="text-muted-foreground text-sm mb-4">{room.description}</p>
              )}

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Capacity:</p>
                <p className="text-pale-white font-medium mb-4">
                  {room.maxOccupancy ? `Up to ${room.maxOccupancy} guests` : 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground mb-2">Features:</p>
                <div className="flex flex-wrap gap-2">
                  {room.features && Array.isArray(room.features) && room.features.length > 0 ? (
                    room.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-jade-deep/30 text-jade-bright text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs">No features added</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(room)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(room._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;
