import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Json } from "@/integrations/supabase/types";

interface StatusHistoryItem {
  status: string;
  timestamp: string;
  previous_status?: string;
}

interface OrderTrackingProps {
  status: string;
  trackingNumber?: string | null;
  carrier?: string | null;
  estimatedDelivery?: string | null;
  statusHistory?: Json;
  lastStatusUpdate?: string | null;
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export function OrderTracking({
  status,
  trackingNumber,
  carrier,
  estimatedDelivery,
  statusHistory,
  lastStatusUpdate,
}: OrderTrackingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepIndex = statusSteps.findIndex(
      (step) => step.key === status.toLowerCase()
    );
    setCurrentStep(stepIndex >= 0 ? stepIndex : 0);
  }, [status]);

  const parseStatusHistory = (history: Json): StatusHistoryItem[] => {
    if (Array.isArray(history)) {
      return history.map((item) => {
        const obj = item as Record<string, unknown>;
        return {
          status: String(obj.status || ""),
          timestamp: String(obj.timestamp || ""),
          previous_status: obj.previous_status ? String(obj.previous_status) : undefined,
        };
      });
    }
    return [];
  };

  const history = parseStatusHistory(statusHistory || []);

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="relative">
        <div className="flex justify-between">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                    isCurrent && "ring-4 ring-primary/20"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 font-medium text-center",
                    isCompleted ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${(currentStep / (statusSteps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Tracking Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
        {trackingNumber && (
          <div>
            <p className="text-xs text-muted-foreground">Tracking Number</p>
            <p className="font-mono text-sm font-medium text-foreground">
              {trackingNumber}
            </p>
          </div>
        )}
        {carrier && (
          <div>
            <p className="text-xs text-muted-foreground">Carrier</p>
            <p className="text-sm font-medium text-foreground">{carrier}</p>
          </div>
        )}
        {estimatedDelivery && (
          <div>
            <p className="text-xs text-muted-foreground">Estimated Delivery</p>
            <p className="text-sm font-medium text-foreground">
              {new Date(estimatedDelivery).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        )}
        {lastStatusUpdate && (
          <div>
            <p className="text-xs text-muted-foreground">Last Updated</p>
            <p className="text-sm font-medium text-foreground">
              {new Date(lastStatusUpdate).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}
      </div>

      {/* Status History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Status History</h4>
          <div className="space-y-2">
            {history.reverse().map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-sm"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                <div className="flex-1">
                  <p className="font-medium text-foreground capitalize">
                    {item.status.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
