import { useEffect, useState } from "react";
import { useCustomers } from "@/hooks/use-customers";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomerEditDialogProps {
  customer: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerEditDialog({ customer, open, onOpenChange }: CustomerEditDialogProps) {
  const { updateCustomer } = useCustomers();
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "", notes: "" });

  useEffect(() => {
    if (customer && open) {
      setFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        notes: customer.notes || "",
      });
    }
  }, [customer, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    updateCustomer.mutate({ id: customer.id, data: formData }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader><DialogTitle>Customer Details</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>Name</Label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Address</Label>
            <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div className="sm:col-span-2 rounded-lg bg-secondary p-3 text-sm">
            Total spent: <span className="font-semibold">₵{Number(customer?.totalSpent || 0).toLocaleString()}</span>
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" disabled={updateCustomer.isPending}>{updateCustomer.isPending ? "Saving..." : "Save Customer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
