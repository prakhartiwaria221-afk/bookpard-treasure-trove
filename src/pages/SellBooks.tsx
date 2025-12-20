import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function SellBooks() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    condition: "",
    price: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.email) {
        setFormData(prev => ({ ...prev, contactEmail: user.email || "" }));
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user?.email) {
        setFormData(prev => ({ ...prev, contactEmail: session.user.email || "" }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File, userId: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('book-images')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('book-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to sell your books", {
        action: {
          label: "Login",
          onClick: () => navigate("/auth"),
        },
      });
      return;
    }

    if (!formData.title || !formData.author || !formData.category || !formData.condition || !formData.price || !formData.contactEmail || !formData.contactPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Upload image if provided
      let imageUrl: string | null = null;
      if (image) {
        imageUrl = await uploadImage(image, user.id);
        if (!imageUrl) {
          toast.error("Failed to upload image. Please try again.");
          setLoading(false);
          return;
        }
      }

      // Map condition to database format
      const conditionMap: Record<string, string> = {
        'excellent': 'new',
        'good': 'old',
        'average': 'old'
      };

      // Insert listing into database
      const { error } = await supabase
        .from('user_listings')
        .insert({
          user_id: user.id,
          title: formData.title,
          author: formData.author,
          category: formData.category,
          condition: conditionMap[formData.condition] || 'old',
          price: parseInt(formData.price),
          description: formData.description || null,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          image_url: imageUrl,
          status: 'active'
        });

      if (error) {
        console.error('Insert error:', error);
        toast.error("Failed to submit listing. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Your book listing has been submitted successfully!", {
        description: "Your book is now visible in the All Books section.",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });

      // Reset form
      setFormData({
        title: "",
        author: "",
        category: "",
        condition: "",
        price: "",
        description: "",
        contactEmail: user.email || "",
        contactPhone: "",
      });
      setImage(null);
      setImagePreview("");
    } catch (error) {
      console.error('Submit error:', error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={0} onSearchChange={() => {}} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Sell Your <span className="text-primary">Old Books</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Give your books a new home and earn money! Fill out the form below to list your book.
            </p>
          </div>

          {/* Login prompt if not authenticated */}
          {!user && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8 text-center">
              <p className="text-foreground mb-4">You need to be logged in to sell your books.</p>
              <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90">
                Login / Sign Up
              </Button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-8 shadow-[var(--shadow-card)] space-y-6">
            {/* Book Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Book Image</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="image" className="cursor-pointer">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">Click to upload book image</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Book Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter book title"
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Author Name *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Enter author name"
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kids">Kids</SelectItem>
                  <SelectItem value="Fiction">Fiction</SelectItem>
                  <SelectItem value="Mystery">Mystery</SelectItem>
                  <SelectItem value="Romance">Romance</SelectItem>
                  <SelectItem value="Horror">Horror</SelectItem>
                  <SelectItem value="Study">Study</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <Label htmlFor="condition">Book Condition *</Label>
              <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Selling Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Enter selling price"
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us more about the book condition, edition, etc."
                rows={4}
                className="bg-muted/50 border-border resize-none"
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="Your email address"
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="Your phone number"
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={loading || !user}
              className="w-full bg-gradient-to-r from-primary to-coral-dark hover:opacity-90 shadow-[var(--shadow-hover)] transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Listing"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
