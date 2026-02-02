import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Transaction {
  id: string;
  amount: number;
  transaction_type: 'credit' | 'debit';
  description: string | null;
  created_at: string;
}

export const WalletBalance = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch wallet balance
      const { data: wallet } = await supabase
        .from("user_wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (wallet) {
        setBalance(wallet.balance);
      }

      // Fetch recent transactions
      const { data: txns } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (txns) {
        setTransactions(txns as Transaction[]);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-32 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-500/10 via-background to-teal-500/10 border-emerald-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-500" />
              My Wallet
            </CardTitle>
            <CardDescription>Use wallet balance at checkout</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-emerald-500">₹{balance}</p>
            <p className="text-sm text-muted-foreground">Available Balance</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">Recent Transactions</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {transactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      txn.transaction_type === 'credit' 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {txn.transaction_type === 'credit' ? (
                        <ArrowDownRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{txn.description || 'Transaction'}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(txn.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    txn.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {txn.transaction_type === 'credit' ? '+' : '-'}₹{txn.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No transactions yet. Redeem gift cards or earn referral rewards!
          </p>
        )}
      </CardContent>
    </Card>
  );
};
