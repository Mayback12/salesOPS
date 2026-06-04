import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpenses } from "@/hooks/use-expenses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { ExpenseEditDialog } from "@/components/dashboard/expense-edit-dialog";

export function ExpensesSection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
  const [expenseEditOpen, setExpenseEditOpen] = useState(false);
  const { expenses, isLoading } = useExpenses();

  const filteredExpenses = expenses.filter((e: any) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Expenses</h2>
          <p className="text-muted-foreground">Track your business costs and restocks</p>
        </div>
        <Button
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          onClick={() => navigate("/expenses/new")}
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          className="border-none bg-transparent focus-visible:ring-0 px-0 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="text-base font-semibold">Expense Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 md:px-6 py-4 font-medium">Expense</th>
                  <th className="hidden sm:table-cell px-6 py-4 font-medium">Category</th>
                  <th className="hidden md:table-cell px-6 py-4 font-medium">Date</th>
                  <th className="px-4 md:px-6 py-4 font-medium">Amount</th>
                  <th className="px-4 md:px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 md:px-6 py-12 text-center text-muted-foreground">
                      Loading expenses...
                    </td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 md:px-6 py-12 text-center text-muted-foreground">
                      No expenses found.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense: any) => (
                    <tr key={expense.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 md:px-6 py-4">
                        <div className="font-medium text-foreground truncate max-w-[120px] md:max-w-none">{expense.title}</div>
                        <div className="sm:hidden text-xs text-muted-foreground capitalize mt-0.5">{expense.category.toLowerCase()}</div>
                        <div className="md:hidden text-xs text-muted-foreground mt-0.5">{format(new Date(expense.expenseDate), 'MMM dd')}</div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 capitalize">{expense.category.toLowerCase()}</td>
                      <td className="hidden md:table-cell px-6 py-4">{format(new Date(expense.expenseDate), 'MMM dd, yyyy')}</td>
                      <td className="px-4 md:px-6 py-4 font-medium text-destructive">₵{expense.amount.toLocaleString()}</td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 md:px-3 text-xs md:text-sm"
                          onClick={() => {
                            setSelectedExpense(expense);
                            setExpenseEditOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <ExpenseEditDialog
        expense={selectedExpense}
        open={expenseEditOpen}
        onOpenChange={setExpenseEditOpen}
      />
    </div>
  );
}
