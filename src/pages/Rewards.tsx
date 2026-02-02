import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GiftCardPurchase } from "@/components/GiftCardPurchase";
import { GiftCardRedeem } from "@/components/GiftCardRedeem";
import { ReferralProgram } from "@/components/ReferralProgram";
import { WalletBalance } from "@/components/WalletBalance";
import { ArrowLeft, Gift, Users, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";

export default function Rewards() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} onSearchChange={() => {}} />

      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Rewards & Gift Cards</h1>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="max-w-md mx-auto text-center py-12 space-y-4">
            <Gift className="h-16 w-16 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-bold">Login Required</h2>
            <p className="text-muted-foreground">
              Please login to access gift cards, referral program, and wallet.
            </p>
            <Button onClick={() => navigate("/auth")} className="bg-primary">
              Login / Sign Up
            </Button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="wallet" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="wallet" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Wallet
                </TabsTrigger>
                <TabsTrigger value="gift-cards" className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Gift Cards
                </TabsTrigger>
                <TabsTrigger value="referrals" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Referrals
                </TabsTrigger>
              </TabsList>

              <TabsContent value="wallet" className="space-y-6">
                <WalletBalance />
                <GiftCardRedeem />
              </TabsContent>

              <TabsContent value="gift-cards" className="space-y-6">
                <GiftCardPurchase />
                <GiftCardRedeem />
              </TabsContent>

              <TabsContent value="referrals">
                <ReferralProgram />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
