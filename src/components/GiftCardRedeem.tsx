import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Search, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GiftCardRedeemProps {
  onRedeemed?: (balance: number) => void;
}

export const GiftCardRedeem = ({ onRedeemed }: GiftCardRedeemProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardInfo, setCardInfo] = useState<{ balance: number; amount: number } | null>(null);

  const handleCheck = async () => {
    if (!code.trim()) {
      toast.error("Please enter a gift card code");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gift_cards")
        .select("balance, amount, is_active, expires_at")
        .eq("code", code.toUpperCase().trim())
        .single();

      if (error || !data) {
        toast.error("Invalid gift card code");
        setCardInfo(null);
        return;
      }

      if (!data.is_active) {
        toast.error("This gift card is no longer active");
        setCardInfo(null);
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast.error("This gift card has expired");
        setCardInfo(null);
        return;
      }

      if (data.balance <= 0) {
        toast.error("This gift card has no remaining balance");
        setCardInfo(null);
        return;
      }

      setCardInfo({ balance: data.balance, amount: data.amount });
      toast.success(`Gift card found! Balance: ₹${data.balance}`);
    } catch (error) {
      console.error("Error checking gift card:", error);
      toast.error("Failed to check gift card");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!cardInfo) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login to redeem gift card");
      return;
    }

    setLoading(true);
    try {
      // Get or create wallet
      let { data: wallet, error: walletError } = await supabase
        .from("user_wallets")
        .select("id, balance")
        .eq("user_id", user.id)
        .single();

      if (walletError && walletError.code === 'PGRST116') {
        // Create wallet if doesn't exist
        const { data: newWallet, error: createError } = await supabase
          .from("user_wallets")
          .insert({ user_id: user.id, balance: 0 })
          .select()
          .single();
        
        if (createError) throw createError;
        wallet = newWallet;
      } else if (walletError) {
        throw walletError;
      }

      // Update wallet balance
      const newBalance = (wallet?.balance || 0) + cardInfo.balance;
      const { error: updateWalletError } = await supabase
        .from("user_wallets")
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);

      if (updateWalletError) throw updateWalletError;

      // Update gift card
      const { error: updateCardError } = await supabase
        .from("gift_cards")
        .update({ balance: 0, redeemed_at: new Date().toISOString() })
        .eq("code", code.toUpperCase().trim());

      if (updateCardError) throw updateCardError;

      // Log transaction
      await supabase.from("wallet_transactions").insert({
        user_id: user.id,
        amount: cardInfo.balance,
        transaction_type: "credit",
        description: `Gift card redemption: ${code}`,
        reference_type: "gift_card",
      });

      toast.success(`₹${cardInfo.balance} added to your wallet!`);
      onRedeemed?.(cardInfo.balance);
      setCode("");
      setCardInfo(null);
    } catch (error) {
      console.error("Error redeeming gift card:", error);
      toast.error("Failed to redeem gift card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Redeem Gift Card
        </CardTitle>
        <CardDescription>
          Have a gift card? Enter the code to add balance to your wallet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="gift-code">Gift Card Code</Label>
            <Input
              id="gift-code"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="font-mono text-lg tracking-wider"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleCheck} disabled={loading} variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {cardInfo && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">₹{cardInfo.balance}</p>
              </div>
              <Button onClick={handleRedeem} disabled={loading} className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Redeem Now
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
