import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Sparkles, CreditCard, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const giftCardAmounts = [250, 500, 1000, 2000, 5000];

interface GiftCardPurchaseProps {
  onPurchased?: (code: string) => void;
}

export const GiftCardPurchase = ({ onPurchased }: GiftCardPurchaseProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [purchasedCard, setPurchasedCard] = useState<{ code: string; amount: number } | null>(null);

  const handlePurchase = async () => {
    const amount = selectedAmount || parseInt(customAmount);
    
    if (!amount || amount < 100) {
      toast.error("Please select or enter a valid amount (minimum ₹100)");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login to purchase gift cards");
      return;
    }

    setLoading(true);
    try {
      // Generate gift card code
      const { data: codeData, error: codeError } = await supabase.rpc('generate_gift_card_code');
      if (codeError) throw codeError;

      const code = codeData || `GC-${Date.now()}`;

      // Create gift card
      const { error } = await supabase.from("gift_cards").insert({
        code,
        amount,
        balance: amount,
        purchased_by: user.id,
        recipient_email: recipientEmail || null,
        message: message || null,
      });

      if (error) throw error;

      setPurchasedCard({ code, amount });
      onPurchased?.(code);
      toast.success("Gift card purchased successfully!");
    } catch (error) {
      console.error("Error purchasing gift card:", error);
      toast.error("Failed to purchase gift card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-primary to-coral-dark rounded-2xl shadow-lg">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            BookPard Gift Cards
            <Sparkles className="h-5 w-5 text-primary" />
          </CardTitle>
          <CardDescription>
            Give the gift of reading! Perfect for book lovers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Amount</Label>
            <div className="grid grid-cols-5 gap-2">
              {giftCardAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className={`h-12 ${selectedAmount === amount ? "bg-primary" : ""}`}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">or</span>
              <Input
                type="number"
                placeholder="Custom amount (min ₹100)"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="flex-1"
              />
            </div>
          </div>

          {/* Recipient Email (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="recipient-email">Recipient Email (Optional)</Label>
            <Input
              id="recipient-email"
              type="email"
              placeholder="Send directly to someone's email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>

          {/* Personal Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            disabled={loading || (!selectedAmount && !customAmount)}
            className="w-full h-12 bg-gradient-to-r from-primary to-coral-dark hover:opacity-90 text-lg"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Purchase Gift Card - ₹{selectedAmount || customAmount || 0}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={!!purchasedCard} onOpenChange={() => setPurchasedCard(null)}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto mb-4 p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl">Gift Card Purchased!</DialogTitle>
            <DialogDescription>
              Your gift card is ready to use or share.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted rounded-xl p-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Gift Card Code</p>
              <p className="text-2xl font-mono font-bold text-primary tracking-wider">
                {purchasedCard?.code}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Value</p>
              <p className="text-xl font-bold">₹{purchasedCard?.amount}</p>
            </div>
          </div>
          <Button onClick={() => setPurchasedCard(null)} className="w-full">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
