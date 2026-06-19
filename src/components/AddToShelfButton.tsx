import { useEffect, useState } from "react";
import { BookMarked, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/types/book";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Status = "want_to_read" | "reading" | "finished";

const LABELS: Record<Status, string> = {
  want_to_read: "Want to Read",
  reading: "Currently Reading",
  finished: "Finished",
};

interface Props {
  book: Book;
  className?: string;
}

export const AddToShelfButton = ({ book, className }: Props) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setUserId(s?.user.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setStatus(null);
      return;
    }
    supabase
      .from("reading_lists")
      .select("status")
      .eq("user_id", userId)
      .eq("book_id", book.id)
      .maybeSingle()
      .then(({ data }) => setStatus((data?.status as Status) ?? null));
  }, [userId, book.id]);

  const handlePick = async (e: React.MouseEvent, newStatus: Status) => {
    e.stopPropagation();
    if (!userId) {
      toast.error("Please sign in to use your shelf");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("reading_lists").upsert(
      {
        user_id: userId,
        book_id: book.id,
        book_title: book.title,
        book_author: book.author,
        book_image: book.image,
        status: newStatus,
      },
      { onConflict: "user_id,book_id" }
    );
    setLoading(false);
    if (error) {
      toast.error("Couldn't save to shelf");
    } else {
      setStatus(newStatus);
      toast.success(`Added to "${LABELS[newStatus]}"`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
          status
            ? "bg-primary/10 text-primary border-primary/30"
            : "bg-card text-foreground border-border hover:bg-primary/5"
        } ${className ?? ""}`}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : status ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <BookMarked className="h-3.5 w-3.5" />
        )}
        {status ? LABELS[status] : "Add to Shelf"}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50">
        {(Object.keys(LABELS) as Status[]).map((s) => (
          <DropdownMenuItem key={s} onClick={(e) => handlePick(e, s)}>
            {LABELS[s]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
