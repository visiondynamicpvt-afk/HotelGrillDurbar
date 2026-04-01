import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL, getResponseMessage, parseJsonResponse } from '@/lib/http';

interface ContentSection {
  sectionName: string;
  content: Record<string, any>;
  images: string[];
}

const Content = () => {
  const [sections, setSections] = useState<Record<string, ContentSection>>({});
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const contentSections = [
    { id: 'home', label: 'Homepage', fields: ['title', 'subtitle', 'description'] },
    { id: 'about', label: 'About Us', fields: ['title', 'description', 'history'] },
    { id: 'facilities', label: 'Facilities', fields: ['title', 'description'] },
    { id: 'restaurant', label: 'Restaurant', fields: ['title', 'description', 'menu'] },
    { id: 'contact', label: 'Contact', fields: ['address', 'phone', 'email', 'hours'] },
  ];

  useEffect(() => {
    loadAllSections();
  }, []);

  const loadAllSections = async () => {
    try {
      const loadedSections: Record<string, ContentSection> = {};
      
      for (const section of contentSections) {
        try {
          const token = localStorage.getItem('admin_token');
          
          const response = await fetch(`${API_BASE_URL}/admin/content/${section.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const result = await parseJsonResponse<{ data: ContentSection }>(response);

          if (response.ok && result) {
            loadedSections[section.id] = result.data;
          }
        } catch (error) {
          console.error(`Failed to load ${section.id}:`, error);
        }
      }

      setSections(loadedSections);
    } catch (error: any) {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const loadSection = async (sectionId: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch(`${API_BASE_URL}/admin/content/${sectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await parseJsonResponse<{ data: ContentSection }>(response);

      if (response.ok && result) {
        setSections((prev) => ({
          ...prev,
          [sectionId]: result.data,
        }));
      }
    } catch (error) {
      console.error('Failed to load section:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const section = sections[activeSection];
      if (!section) return;

      const token = localStorage.getItem('admin_token');

      const response = await fetch(`${API_BASE_URL}/admin/content/${activeSection}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: section.content,
          images: section.images || [],
        }),
      });

      if (response.ok) {
        toast.success('Content saved successfully');
        await loadSection(activeSection);
      } else {
        const result = await parseJsonResponse<{ message?: string }>(response);
        throw new Error(getResponseMessage(response, result, 'Failed to save'));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (field: string, value: string) => {
    setSections((prev) => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        sectionName: activeSection,
        content: {
          ...(prev[activeSection]?.content || {}),
          [field]: value,
        },
        images: prev[activeSection]?.images || [],
      },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('image', e.target.files[0]);

      const response = await fetch(`${API_BASE_URL}/admin/content/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await parseJsonResponse<{ data: { url: string }; message?: string }>(response);

      if (response.ok && result) {
        const imageUrl = result.data.url;

        setSections((prev) => ({
          ...prev,
          [activeSection]: {
            ...prev[activeSection],
            sectionName: activeSection,
            content: prev[activeSection]?.content || {},
            images: [...(prev[activeSection]?.images || []), imageUrl],
          },
        }));

        toast.success('Image uploaded successfully');
      } else {
        throw new Error(getResponseMessage(response, result, 'Failed to upload image'));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageUrl: string) => {
    setSections((prev) => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        images: (prev[activeSection]?.images || []).filter((img) => img !== imageUrl),
      },
    }));
  };

  const currentSection = sections[activeSection] || {
    sectionName: activeSection,
    content: {},
    images: [],
  };

  const sectionConfig = contentSections.find((s) => s.id === activeSection);

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-display text-pale-white mb-2">Content Management</h1>
          <p className="text-muted-foreground">Manage website content and sections</p>
        </div>
        <GlassCard className="p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin">
              <div className="w-8 h-8 border-4 border-jade-bright border-t-transparent rounded-full"></div>
            </div>
            <p className="text-muted-foreground">Loading content sections...</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-display text-pale-white mb-2">Content Management</h1>
        <p className="text-muted-foreground">Manage website content and sections</p>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          {contentSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {contentSections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <GlassCard className="p-6">
              <div className="space-y-6">
                {/* Content Fields */}
                {section.fields.map((field) => (
                  <div key={field}>
                    <Label className="text-pale-white/80 mb-2 block capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    {field === 'description' || field === 'history' || field === 'menu' ? (
                      <Textarea
                        value={currentSection.content[field] || ''}
                        onChange={(e) => handleContentChange(field, e.target.value)}
                        className="bg-charcoal-deep/50 border-border text-pale-white min-h-[150px]"
                        placeholder={`Enter ${field}...`}
                      />
                    ) : (
                      <Input
                        value={currentSection.content[field] || ''}
                        onChange={(e) => handleContentChange(field, e.target.value)}
                        className="bg-charcoal-deep/50 border-border text-pale-white"
                        placeholder={`Enter ${field}...`}
                      />
                    )}
                  </div>
                ))}

                {/* Image Upload */}
                <div>
                  <Label className="text-pale-white/80 mb-2 block">Images</Label>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {currentSection.images?.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL.replace('/api', '')}${imageUrl}`}
                          alt={`${section.label} ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg border border-border"
                        />
                        <button
                          onClick={() => removeImage(imageUrl)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <Label htmlFor="image-upload">
                      <Button
                        type="button"
                        variant="outline"
                        asChild
                        disabled={uploading}
                        className="cursor-pointer"
                      >
                        <span>
                          {uploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Image
                            </>
                          )}
                        </span>
                      </Button>
                    </Label>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving} className="bg-jade-bright hover:bg-jade-deep">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Content;
