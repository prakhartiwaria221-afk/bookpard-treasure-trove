import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileSpreadsheet, Download, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CSVRow {
  title: string;
  author: string;
  category: string;
  condition: string;
  price: string;
  description?: string;
  stock_quantity?: string;
}

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

export function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const headers = "title,author,category,condition,price,description,stock_quantity";
    const example1 = "Harry Potter and the Philosopher's Stone,J.K. Rowling,Fiction,excellent,299,First book in the series,5";
    const example2 = "The Great Gatsby,F. Scott Fitzgerald,Fiction,good,199,Classic American novel,3";
    
    const csvContent = `${headers}\n${example1}\n${example2}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "book_upload_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, ""));
    const rows: CSVRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
      const row: any = {};
      
      headers.forEach((header, index) => {
        let value = values[index]?.trim().replace(/^"|"$/g, "") || "";
        row[header] = value;
      });

      if (row.title && row.author && row.category && row.condition && row.price) {
        rows.push(row);
      }
    }

    return rows;
  };

  const validateRow = (row: CSVRow, index: number): string | null => {
    if (!row.title) return `Row ${index + 1}: Missing title`;
    if (!row.author) return `Row ${index + 1}: Missing author`;
    if (!row.category) return `Row ${index + 1}: Missing category`;
    if (!row.condition) return `Row ${index + 1}: Missing condition`;
    if (!row.price || isNaN(parseFloat(row.price))) return `Row ${index + 1}: Invalid price`;
    
    const validCategories = ["Kids", "Fiction", "Mystery", "Romance", "Horror", "Study"];
    if (!validCategories.includes(row.category)) {
      return `Row ${index + 1}: Invalid category "${row.category}". Must be one of: ${validCategories.join(", ")}`;
    }

    const validConditions = ["excellent", "good", "average"];
    if (!validConditions.includes(row.condition.toLowerCase())) {
      return `Row ${index + 1}: Invalid condition "${row.condition}". Must be one of: ${validConditions.join(", ")}`;
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to upload books");
      return;
    }

    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      if (rows.length === 0) {
        toast.error("No valid data found in CSV");
        setUploading(false);
        return;
      }

      const uploadResult: UploadResult = {
        success: 0,
        failed: 0,
        errors: [],
      };

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const validationError = validateRow(row, i);

        if (validationError) {
          uploadResult.failed++;
          uploadResult.errors.push(validationError);
          setProgress(((i + 1) / rows.length) * 100);
          continue;
        }

        // Insert listing
        const { data: newListing, error: listingError } = await supabase
          .from("user_listings")
          .insert({
            user_id: user.id,
            title: row.title,
            author: row.author,
            category: row.category,
            condition: row.condition.toLowerCase(),
            price: parseInt(row.price),
            description: row.description || null,
            stock_quantity: row.stock_quantity ? parseInt(row.stock_quantity) : 1,
            status: "active",
          })
          .select("id")
          .single();

        if (listingError) {
          uploadResult.failed++;
          uploadResult.errors.push(`Row ${i + 1}: ${listingError.message}`);
        } else {
          // Insert contact info
          const { error: contactError } = await supabase
            .from("listing_contacts")
            .insert({
              listing_id: newListing.id,
              contact_email: user.email || "",
              contact_phone: "",
            });

          if (contactError) {
            // Rollback listing
            await supabase.from("user_listings").delete().eq("id", newListing.id);
            uploadResult.failed++;
            uploadResult.errors.push(`Row ${i + 1}: Failed to save contact info`);
          } else {
            uploadResult.success++;
          }
        }

        setProgress(((i + 1) / rows.length) * 100);
      }

      setResult(uploadResult);

      if (uploadResult.success > 0) {
        toast.success(`Successfully uploaded ${uploadResult.success} books`);
      }
      if (uploadResult.failed > 0) {
        toast.error(`Failed to upload ${uploadResult.failed} books`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to process CSV file");
    } finally {
      setUploading(false);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileSpreadsheet className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Bulk Upload Books</h3>
      </div>

      {/* Template Download */}
      <div className="p-4 bg-muted/30 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground mb-3">
          Download our CSV template to ensure your data is formatted correctly
        </p>
        <Button variant="outline" size="sm" onClick={downloadTemplate}>
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>

      {/* File Upload */}
      <div className="space-y-4">
        <Label htmlFor="csv-file">Upload CSV File</Label>
        <div className="flex gap-3">
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="flex-1"
          />
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>

        {file && (
          <p className="text-sm text-muted-foreground">
            Selected: {file.name}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            {Math.round(progress)}% complete
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>{result.success} successful</span>
            </div>
            {result.failed > 0 && (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                <span>{result.failed} failed</span>
              </div>
            )}
          </div>

          {result.errors.length > 0 && (
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Errors</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-muted/30 rounded-lg border border-border">
        <h4 className="font-medium text-foreground mb-2">CSV Format Requirements</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>title</strong>: Book title (required)</li>
          <li>• <strong>author</strong>: Author name (required)</li>
          <li>• <strong>category</strong>: Kids, Fiction, Mystery, Romance, Horror, or Study (required)</li>
          <li>• <strong>condition</strong>: excellent, good, or average (required)</li>
          <li>• <strong>price</strong>: Price in INR (required)</li>
          <li>• <strong>description</strong>: Book description (optional)</li>
          <li>• <strong>stock_quantity</strong>: Number in stock (optional, defaults to 1)</li>
        </ul>
      </div>
    </div>
  );
}
