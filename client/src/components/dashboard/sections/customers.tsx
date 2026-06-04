import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomers } from "@/hooks/use-customers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerEditDialog } from "@/components/dashboard/customer-edit-dialog";

export function CustomersSection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const { customers, isLoading } = useCustomers();

  const filteredCustomers = customers.filter((c: any) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone && c.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Customers</h2>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <Button
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          onClick={() => navigate("/customers/new")}
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search customers by name or phone..."
          className="border-none bg-transparent focus-visible:ring-0 px-0 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="text-base font-semibold">Customer List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
                  <th className="px-6 py-4 font-medium">Total Spent</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer: any) => (
                    <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{customer.name}</td>
                      <td className="px-6 py-4">{customer.phone || 'N/A'}</td>
                      <td className="px-6 py-4 font-medium text-foreground">₵{customer.totalSpent.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setCustomerDialogOpen(true);
                          }}
                        >
                          Details
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
      <CustomerEditDialog
        customer={selectedCustomer}
        open={customerDialogOpen}
        onOpenChange={setCustomerDialogOpen}
      />
    </div>
  );
}
