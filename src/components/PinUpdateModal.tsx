import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api-services/api-services";
import { toast } from "sonner";

interface PinUpdateModalProps {
  isOpen: boolean;
}

export default function PinUpdateModal({ isOpen }: PinUpdateModalProps) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }

    if (pin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/users/me/update-pin", { pin });
      toast.success("PIN updated successfully");
      window.location.reload(); // Reload to refresh the PIN status
    } catch (error) {
      toast.error("Failed to update PIN");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Update Your PIN
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="pin">New PIN (4 digits)</Label>
            <Input
              id="pin"
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 4-digit PIN"
              disabled={isLoading}
              className="h-12 text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPin">Confirm PIN</Label>
            <Input
              id="confirmPin"
              type="password"
              maxLength={4}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
              placeholder="Confirm 4-digit PIN"
              disabled={isLoading}
              className="h-12 text-lg"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-lg font-semibold bg-green-600"
            disabled={isLoading || pin.length !== 4 || confirmPin.length !== 4}
          >
            {isLoading ? "Updating..." : "Update PIN"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
