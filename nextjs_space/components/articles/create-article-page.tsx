
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Category } from '@/lib/types';
import { countries, getTranslation } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BalanceDisplay } from '@/components/balance-display';
import { 
  PlusCircle, 
  Upload, 
  Loader2,
  AlertCircle,
  ImageIcon,
  Video
} from 'lucide-react';

export function CreateArticlePage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    country: '',
    category: '',
    language: 'en',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentLang] = useState('en');
  const { toast } = useToast();

  const t = (key: string) => getTranslation(key, currentLang);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (session?.accessToken) {
      apiClient.setToken(session.accessToken);
      fetchCategories();
    }
  }, [status, session?.accessToken, router]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await apiClient.getCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 10); // Max 10 images
      
      // Check file size (max 10MB per image)
      const oversizedFiles = newImages.filter(file => file.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast({
          title: 'File Size Error',
          description: 'Each image must be under 10MB',
          variant: 'destructive',
        });
        return;
      }

      setImages(prev => [...prev, ...newImages].slice(0, 10));
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 35MB)
      if (file.size > 35 * 1024 * 1024) {
        toast({
          title: 'File Size Error',
          description: 'Video must be under 35MB',
          variant: 'destructive',
        });
        return;
      }
      setVideo(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.country || !formData.category) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please fill in title, content, country, and category',
        variant: 'destructive',
      });
      return;
    }

    if (formData.content.length > 10000) {
      toast({
        title: 'Content Too Long',
        description: 'Content must be under 10,000 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Find category ID
      const selectedCategory = categories.find(cat => cat?.slug === formData.category);
      
      const articleData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        language: formData.language,
        status: 'PUBLISHED',
        category_id: selectedCategory?.id,
      };

      const response = await apiClient.createArticle(articleData);
      
      toast({
        title: 'Success!',
        description: 'Article published! 1 ACD deducted',
      });
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to create article:', error);
      toast({
        title: 'Publication Failed',
        description: 'Insufficient balance or network error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const characterCount = formData.content.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Article
          </h1>
          <p className="text-gray-600">
            Share your story with the world. Publishing costs 1 ACD.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Article Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title">{t('form.title')} *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter article title"
                      required
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <Label htmlFor="content">
                      {t('form.content')} * ({characterCount}/10,000 characters)
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Write your article content here..."
                      className="min-h-[300px]"
                      required
                    />
                    {characterCount > 9000 && (
                      <p className="text-amber-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Approaching character limit
                      </p>
                    )}
                  </div>

                  {/* Country and Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('form.country')} *</Label>
                      <Select value={formData.country || ''} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, country: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries?.map((country) => (
                            <SelectItem key={country?.code || `country-${Math.random()}`} value={country?.code || 'unknown'}>
                              {country?.flag} {country?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>{t('form.category')} *</Label>
                      <Select value={formData.category || ''} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, category: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category?.id || `cat-${Math.random()}`} value={category?.slug || 'unknown'}>
                              {category?.name || 'Unknown'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Media Upload */}
                  <div className="space-y-4">
                    <Label>Media Files</Label>
                    
                    {/* Images */}
                    <div>
                      <Label htmlFor="images" className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Upload Images (Max 10 files, 10MB each)
                          </p>
                        </div>
                      </Label>
                      <input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      
                      {/* Image Preview */}
                      {images?.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {images.map((image, index) => (
                            <div key={index} className="relative">
                              <div className="aspect-square bg-gray-100 rounded border overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-600 p-2 text-center break-words">
                                  {image.name}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                onClick={() => removeImage(index)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Video */}
                    <div>
                      <Label htmlFor="video" className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          <Video className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Upload Video (Max 35MB)
                          </p>
                        </div>
                      </Label>
                      <input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                      
                      {video && (
                        <div className="mt-3 flex items-center justify-between p-3 bg-gray-100 rounded">
                          <span className="text-sm text-gray-700">{video.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setVideo(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        {t('form.publish')} (1 ACD)
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Balance Display */}
            <Card>
              <CardHeader>
                <CardTitle>Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <BalanceDisplay showTopUpButton={true} />
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                  <p className="font-semibold text-blue-800 mb-1">Publishing Cost</p>
                  <p className="text-blue-600">1 ACD will be deducted to publish this article</p>
                </div>
              </CardContent>
            </Card>

            {/* Publishing Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Maximum 10,000 characters for content</p>
                <p>• Up to 10 images, 10MB each</p>
                <p>• One video file, maximum 35MB</p>
                <p>• Country and category are required</p>
                <p>• Content will be published immediately</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
