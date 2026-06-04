import { useEffect, useState } from "react";
import { useDebts } from "@/hooks/use-debts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DebtPaymentFormProps {
  debt: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DebtPaymentForm({ debt, open, onOpenChange }: DebtPaymentFormProps) {
  const { recordPayment } = useDebts();
  const [formData, setFormData] = useState({
    amount: 0,
    paidAt: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  useEffect(() => {
    if (debt && open) {
      setFormData({
        amount: Number(debt.balance) || 0,
        paidAt: new Date().toISOString().slice(0, 10),
        notes: "",
      });
    }
  }, [debt, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debt) return;

    recordPayment.mutate(
      { id: debt.id, data: formData },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Record Collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {debt?.customer?.name} still owes your business ₵{Number(debt?.balance || 0).toLocaleString()}.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Amount (₵)</Label>
              <Input
                id="payment-amount"
                type="number"
                min="0.01"
                max={Number(debt?.balance || 0)}
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-date">Date</Label>
              <Input
                id="payment-date"
                type="date"
                value={formData.paidAt}
                onChange={(e) => setFormData({ ...formData, paidAt: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-notes">Notes</Label>
            <Textarea
              id="payment-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={recordPayment.isPending || !debt}>
              {recordPayment.isPending ? "Recording..." : "Record Collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
