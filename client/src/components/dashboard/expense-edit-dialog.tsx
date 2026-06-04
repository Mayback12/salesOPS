import { useEffect, useState } from "react";
import { useExpenses } from "@/hooks/use-expenses";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExpenseCategory } from "@/../../shared/types";

interface ExpenseEditDialogProps {
  expense: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseEditDialog({ expense, open, onOpenChange }: ExpenseEditDialogProps) {
  const { updateExpense } = useExpenses();
  const [formData, setFormData] = useState({ title: "", amount: 0, category: ExpenseCategory.OTHER, description: "", expenseDate: "" });

  useEffect(() => {
    if (expense && open) {
      setFormData({
        title: expense.title || "",
        amount: Number(expense.amount) || 0,
        category: expense.category || ExpenseCategory.OTHER,
        description: expense.description || "",
        expenseDate: expense.expenseDate ? new Date(expense.expenseDate).toISOString().slice(0, 10) : "",
      });
    }
  }, [expense, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense) return;
    updateExpense.mutate({ id: expense.id, data: formData }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader><DialogTitle>Edit Expense</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" min="0" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(category) => setFormData({ ...formData, category: category as ExpenseCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.values(ExpenseCategory).map((category) => <SelectItem key={category} value={category}>{category.replace("_", " ")}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={formData.expenseDate} onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={updateExpense.isPending}>{updateExpense.isPending ? "Saving..." : "Save Expense"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
