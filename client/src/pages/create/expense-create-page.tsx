import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiptText } from "lucide-react";
import { useExpenses } from "@/hooks/use-expenses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExpenseCategory } from "@/../../shared/types";
import { CreatePageShell } from "./create-page-shell";

export function ExpenseCreatePage() {
  const navigate = useNavigate();
  const { createExpense } = useExpenses();
  const [formData, setFormData] = useState({
    title: "",
    amount: 0,
    category: ExpenseCategory.OTHER,
    description: "",
    expenseDate: new Date().toISOString().slice(0, 10),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createExpense.mutate(formData, {
      onSuccess: () => navigate("/expenses"),
    });
  };

  return (
    <CreatePageShell title="Add Expense" description="Record operating costs, restocks, and business spending." backTo="/expenses">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><ReceiptText className="w-4 h-4" /> Expense Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="expense-title">Title</Label>
              <Input id="expense-title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount (₵)</Label>
              <Input id="expense-amount" type="number" min="0" step="0.01" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(category) => setFormData({ ...formData, category: category as ExpenseCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.values(ExpenseCategory).map((category) => <SelectItem key={category} value={category}>{category.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-date">Date</Label>
              <Input id="expense-date" type="date" value={formData.expenseDate} onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="expense-description">Description</Label>
              <Textarea id="expense-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={createExpense.isPending}>
                {createExpense.isPending ? "Saving..." : "Save Expense"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </CreatePageShell>
  );
}
