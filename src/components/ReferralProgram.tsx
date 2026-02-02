import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Copy, Gift, Share2, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReferralStats {
  code: string;
  usesCount: number;
  totalEarned: number;
  pendingRewards: number;
}

export const ReferralProgram = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralCode();
  }, []);

  const fetchReferralCode = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("referral_codes")
        .select("code, uses_count, reward_amount")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (data) {
        setReferralCode(data.code);
        
        // Fetch referral stats
        const { data: referrals } = await supabase
          .from("referrals")
          .select("status, reward_amount")
          .eq("referrer_id", user.id);

        const totalEarned = referrals
          ?.filter(r => r.status === 'rewarded')
          .reduce((sum, r) => sum + (r.reward_amount || 0), 0) || 0;

        const pendingRewards = referrals
          ?.filter(r => r.status === 'completed')
          .reduce((sum, r) => sum + (r.reward_amount || 50), 0) || 0;

        setStats({
          code: data.code,
          usesCount: data.uses_count,
          totalEarned,
          pendingRewards,
        });
      }
    } catch (error) {
      console.error("Error fetching referral code:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login to generate referral code");
      return;
    }

    setGenerating(true);
    try {
      // Generate unique code
      const { data: codeData } = await supabase.rpc('generate_referral_code');
      const code = codeData || `REF${user.id.substring(0, 6).toUpperCase()}`;

      const { error } = await supabase.from("referral_codes").insert({
        user_id: user.id,
        code,
        reward_amount: 50,
      });

      if (error) throw error;

      setReferralCode(code);
      setStats({ code, usesCount: 0, totalEarned: 0, pendingRewards: 0 });
      toast.success("Referral code generated!");
    } catch (error) {
      console.error("Error generating referral code:", error);
      toast.error("Failed to generate referral code");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!referralCode) return;
    
    const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    if (!referralCode) return;
    
    const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;
    const text = `Join BookPard and get ₹50 off your first purchase! Use my referral link: ${referralLink}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text, url: referralLink });
      } catch (error) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-48 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-violet-500/10 via-background to-fuchsia-500/10 border-violet-500/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl shadow-lg">
          <Users className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Refer & Earn</CardTitle>
        <CardDescription>
          Invite friends and earn ₹50 for each successful referral!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!referralCode ? (
          <Button
            onClick={generateReferralCode}
            disabled={generating}
            className="w-full h-12 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Gift className="mr-2 h-5 w-5" />
                Get Your Referral Code
              </>
            )}
          </Button>
        ) : (
          <>
            {/* Referral Code Display */}
            <div className="bg-muted rounded-xl p-4 space-y-3">
              <p className="text-sm text-muted-foreground text-center">Your Referral Code</p>
              <div className="flex items-center gap-2">
                <Input
                  value={referralCode}
                  readOnly
                  className="font-mono text-lg font-bold text-center tracking-wider"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={shareReferral} className="w-full bg-violet-500 hover:bg-violet-600">
                <Share2 className="mr-2 h-4 w-4" />
                Share Referral Link
              </Button>
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-primary">{stats.usesCount}</p>
                  <p className="text-xs text-muted-foreground">Referrals</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-500">₹{stats.totalEarned}</p>
                  <p className="text-xs text-muted-foreground">Earned</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-amber-500">₹{stats.pendingRewards}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            )}

            {/* How it works */}
            <div className="border-t pt-4 space-y-2">
              <p className="font-semibold text-sm">How it works:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Share your referral link with friends</li>
                <li>2. They sign up and make their first purchase</li>
                <li>3. You both get ₹50 in your wallet!</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
