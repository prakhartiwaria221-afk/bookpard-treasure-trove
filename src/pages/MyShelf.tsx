import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { BookMarked, BookOpen, CheckCircle2, Trash2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

type Status = "want_to_read" | "reading" | "finished";

interface ShelfItem {
  id: string;
  book_id: string;
  book_title: string;
  book_author: string;
  book_image: string | null;
  status: Status;
  notes: string | null;
}

const TABS: { value: Status; label: string; icon: any }[] = [
  { value: "want_to_read", label: "Want to Read", icon: BookMarked },
  { value: "reading", label: "Currently Reading", icon: BookOpen },
  { value: "finished", label: "Finished", icon: CheckCircle2 },
];

const MyShelf = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [items, setItems] = useState<ShelfItem[]>([]);
  const [activeTab, setActiveTab] = useState<Status>("want_to_read");
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setAuthed(false);
        return;
      }
      setAuthed(true);
      load();
    });
  }, []);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reading_lists")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) toast.error("Couldn't load shelf");
    setItems((data as ShelfItem[]) ?? []);
    setLoading(false);
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("reading_lists").delete().eq("id", id);
    if (error) return toast.error("Couldn't remove");
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Removed from shelf");
  };

  const move = async (id: string, status: Status) => {
    const { error } = await supabase.from("reading_lists").update({ status }).eq("id", id);
    if (error) return toast.error("Couldn't update");
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    toast.success("Moved");
  };

  if (authed === false) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemCount={totalItems} onSearchChange={() => {}} />
        <div className="pt-32 container mx-auto px-4 text-center">
          <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-playfair font-bold mb-2">Your Reading Shelf</h1>
          <p className="text-muted-foreground mb-6">Sign in to save and organize the books you love.</p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </div>
      </div>
    );
  }

  const filtered = items.filter((i) => i.status === activeTab);
  const counts = {
    want_to_read: items.filter((i) => i.status === "want_to_read").length,
    reading: items.filter((i) => i.status === "reading").length,
    finished: items.filter((i) => i.status === "finished").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} onSearchChange={() => {}} />
      <div className="pt-24 container mx-auto px-4 pb-16">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-3">
            <Leaf className="h-7 w-7 text-primary" />
            <h1 className="text-4xl font-playfair font-bold text-vintage-gradient">My Reading Shelf</h1>
            <Leaf className="h-7 w-7 text-secondary" />
          </div>
          <p className="text-muted-foreground">Your personal bookshelf — grow your reading garden 🌱</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setActiveTab(t.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-card border border-border text-foreground hover:bg-primary/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-muted"}`}>
                  {counts[t.value]}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-16">Loading your shelf…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <BookMarked className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">Nothing in this shelf yet.</p>
            <Button onClick={() => navigate("/")}>Browse Books</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-card border border-border rounded-xl p-3 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all"
              >
                <img
                  src={item.book_image || "/placeholder.svg"}
                  alt={item.book_title}
                  className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0 flex flex-col">
                  <h3 className="font-playfair font-bold text-foreground line-clamp-2 leading-tight">
                    {item.book_title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">{item.book_author}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {TABS.filter((t) => t.value !== item.status).map((t) => (
                      <button
                        key={t.value}
                        onClick={() => move(item.id, t.value)}
                        className="text-[11px] px-2 py-1 rounded-md border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                      >
                        → {t.label}
                      </button>
                    ))}
                    <button
                      onClick={() => remove(item.id)}
                      className="text-[11px] px-2 py-1 rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-all flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyShelf;
