import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreditCard, Smartphone, Banknote, Building2, Wallet2, Calendar, ShoppingBag, CheckCircle2, Gift, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useFireworks } from "@/contexts/FireworksContext";
import { GiftCardRedeem } from "@/components/GiftCardRedeem";

export default function Checkout() {
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const { triggerFireworks } = useFireworks();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form states
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Net Banking
  const [selectedBank, setSelectedBank] = useState("");
  
  // Wallet states
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  
  // Gift card states
  const [giftCardOpen, setGiftCardOpen] = useState(false);
  const [appliedGiftCard, setAppliedGiftCard] = useState<{ code: string; balance: number } | null>(null);
  const [giftCardCode, setGiftCardCode] = useState("");

  // EMI states
  const [emiMonths, setEmiMonths] = useState("3");

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setWalletBalance(data.balance);
    }
  };

  const walletDiscount = useWallet ? Math.min(walletBalance, totalPrice) : 0;
  const giftCardDiscount = appliedGiftCard ? Math.min(appliedGiftCard.balance, totalPrice - walletDiscount) : 0;
  const finalPrice = totalPrice - walletDiscount - giftCardDiscount;

  const handleApplyGiftCard = async () => {
    if (!giftCardCode.trim()) {
      toast.error("Please enter a gift card code");
      return;
    }

    const { data, error } = await supabase
      .from("gift_cards")
      .select("code, balance, is_active")
      .eq("code", giftCardCode.toUpperCase().trim())
      .single();

    if (error || !data || !data.is_active || data.balance <= 0) {
      toast.error("Invalid or empty gift card");
      return;
    }

    setAppliedGiftCard({ code: data.code, balance: data.balance });
    toast.success(`Gift card applied! ₹${data.balance} discount`);
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  const handlePayment = async () => {
    // Validate based on payment method
    if (paymentMethod === "upi" && !upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }
    
    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error("Please fill all card details");
        return;
      }
    }

    if (paymentMethod === "netbanking" && !selectedBank) {
      toast.error("Please select a bank");
      return;
    }

    if (paymentMethod === "cod" && (!deliveryAddress || !phoneNumber)) {
      toast.error("Please fill delivery address and phone number");
      return;
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Deduct wallet balance if used
    if (useWallet && walletDiscount > 0 && user) {
      await supabase
        .from("user_wallets")
        .update({ balance: walletBalance - walletDiscount })
        .eq("user_id", user.id);

      await supabase.from("wallet_transactions").insert({
        user_id: user.id,
        amount: walletDiscount,
        transaction_type: "debit",
        description: "Order payment",
      });
    }

    // Deduct gift card balance if used
    if (appliedGiftCard && giftCardDiscount > 0) {
      await supabase
        .from("gift_cards")
        .update({ balance: appliedGiftCard.balance - giftCardDiscount })
        .eq("code", appliedGiftCard.code);
    }

    // Save order to database
    const { error } = await supabase.from("orders").insert([{
      user_id: user?.id || null,
      items: cart as any,
      total_price: finalPrice,
      payment_method: paymentMethod,
      delivery_address: paymentMethod === "cod" ? deliveryAddress : null,
      contact_phone: paymentMethod === "cod" ? phoneNumber : null,
      contact_email: user?.email || null,
      status: "pending",
    }]);

    if (error) {
      console.error("Error saving order:", error);
      toast.error("Failed to process order. Please try again.");
      return;
    }

    // Trigger celebration fireworks!
    triggerFireworks("high");

    // Show success dialog
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    clearCart();
    navigate("/");
    toast.success("Order placed successfully!");
  };

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Kotak Mahindra Bank",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} onSearchChange={() => {}} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 animate-fade-in">Checkout</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wallet & Gift Card Section */}
              <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] animate-fade-in space-y-4">
                <h2 className="text-xl font-bold text-foreground">Apply Discounts</h2>
                
                {/* Wallet Balance */}
                {walletBalance > 0 && (
                  <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-3">
                      <Wallet2 className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="font-medium">Wallet Balance</p>
                        <p className="text-sm text-muted-foreground">₹{walletBalance} available</p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useWallet}
                        onChange={(e) => setUseWallet(e.target.checked)}
                        className="w-5 h-5 accent-emerald-600"
                      />
                      <span className="text-sm font-medium">Use ₹{Math.min(walletBalance, totalPrice)}</span>
                    </label>
                  </div>
                )}

                {/* Gift Card */}
                <Collapsible open={giftCardOpen} onOpenChange={setGiftCardOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <Gift className="h-5 w-5 text-primary" />
                      <span className="font-medium">Apply Gift Card</span>
                    </div>
                    {giftCardOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    {appliedGiftCard ? (
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div>
                          <p className="font-medium text-green-700 dark:text-green-400">Gift Card Applied!</p>
                          <p className="text-sm text-muted-foreground">Code: {appliedGiftCard.code}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">-₹{giftCardDiscount}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAppliedGiftCard(null)}
                            className="text-red-500 hover:text-red-600"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter gift card code"
                          value={giftCardCode}
                          onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                          className="font-mono"
                        />
                        <Button onClick={handleApplyGiftCard} variant="outline">
                          Apply
                        </Button>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] animate-fade-in">
                <h2 className="text-xl font-bold text-foreground mb-6">Select Payment Method</h2>
                
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <span className="font-medium">UPI Payment</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <span className="font-medium">Debit/Credit Card</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building2 className="h-5 w-5 text-primary" />
                      <span className="font-medium">Net Banking</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="emi" id="emi" />
                    <Label htmlFor="emi" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-medium">EMI (No Cost EMI Available)</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Banknote className="h-5 w-5 text-primary" />
                      <span className="font-medium">Cash on Delivery</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Details Form */}
              <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] animate-fade-in space-y-4">
                <h2 className="text-xl font-bold text-foreground mb-4">Payment Details</h2>
                
                {paymentMethod === "upi" && (
                  <div className="space-y-2">
                    <Label htmlFor="upi-id">UPI ID</Label>
                    <Input
                      id="upi-id"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                )}
                
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        maxLength={16}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Cardholder Name</Label>
                      <Input
                        id="card-name"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          maxLength={3}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="space-y-2">
                    <Label>Select Bank</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {banks.map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-3 text-left rounded-lg border-2 transition-colors ${
                            selectedBank === bank
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span className="text-sm font-medium">{bank}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === "emi" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select EMI Duration</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {["3", "6", "9", "12", "18", "24"].map((months) => (
                          <button
                            key={months}
                            type="button"
                            onClick={() => setEmiMonths(months)}
                            className={`p-3 rounded-lg border-2 transition-colors text-center ${
                              emiMonths === months
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <span className="font-bold">{months}</span>
                            <span className="text-xs text-muted-foreground block">months</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">EMI Amount per month:</p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{Math.ceil(finalPrice / parseInt(emiMonths))}
                      </p>
                      <p className="text-xs text-green-600">No Cost EMI - 0% interest</p>
                    </div>
                    
                    {/* Card details for EMI */}
                    <div className="space-y-2">
                      <Label htmlFor="emi-card-number">Card Number</Label>
                      <Input
                        id="emi-card-number"
                        placeholder="1234 5678 9012 3456"
                        maxLength={16}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                )}
                
                {paymentMethod === "cod" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address</Label>
                      <Input
                        id="address"
                        placeholder="Enter your complete address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+91 9876543210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Pay in cash when your order is delivered.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] sticky top-24 space-y-4">
                <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
                
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-border">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-primary">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 py-4 border-y border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">₹{totalPrice}</span>
                  </div>
                  {walletDiscount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Wallet Discount</span>
                      <span className="font-medium">-₹{walletDiscount}</span>
                    </div>
                  )}
                  {giftCardDiscount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Gift Card</span>
                      <span className="font-medium">-₹{giftCardDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{finalPrice}</span>
                </div>
                
                <Button
                  onClick={handlePayment}
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-coral-dark hover:opacity-90 shadow-[var(--shadow-hover)]"
                >
                  {paymentMethod === "emi" 
                    ? `Pay ₹${Math.ceil(finalPrice / parseInt(emiMonths))}/month`
                    : `Complete Payment`
                  }
                </Button>
                
                <Button
                  onClick={() => navigate("/cart")}
                  variant="outline"
                  className="w-full border-border hover:bg-muted"
                >
                  Back to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-600 animate-fade-in" />
            </div>
            <DialogTitle className="text-2xl">Payment Successful!</DialogTitle>
            <DialogDescription className="text-base">
              Your order has been placed successfully. We'll send you a confirmation email shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Total</span>
              <span className="font-bold">₹{finalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">
                {paymentMethod === "upi" && "UPI"}
                {paymentMethod === "card" && "Card"}
                {paymentMethod === "netbanking" && "Net Banking"}
                {paymentMethod === "emi" && `EMI (${emiMonths} months)`}
                {paymentMethod === "cod" && "Cash on Delivery"}
              </span>
            </div>
          </div>
          <Button
            onClick={handleSuccessClose}
            className="w-full bg-gradient-to-r from-primary to-coral-dark hover:opacity-90"
          >
            Continue Shopping
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
