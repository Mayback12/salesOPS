import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCustomers } from "@/hooks/use-customers";
import { useInventory } from "@/hooks/use-inventory";
import { useSales } from "@/hooks/use-sales";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentMethod } from "@/../../shared/types";
import { CreatePageShell } from "./create-page-shell";

interface SaleItemDraft {
  productId: string;
  quantity: number;
}

const emptyItem = { productId: "", quantity: 1 };

export function SaleCreatePage() {
  const navigate = useNavigate();
  const { products } = useInventory();
  const { customers } = useCustomers();
  const { createSale } = useSales();
  const [customerId, setCustomerId] = useState("walk-in");
  const [items, setItems] = useState<SaleItemDraft[]>([emptyItem]);
  const [amountPaid, setAmountPaid] = useState(0);
  const [amountPaidEdited, setAmountPaidEdited] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CASH);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const productById = useMemo(() => new Map(products.map((product: any) => [product.id, product])), [products]);
  const totalAmount = items.reduce((total, item) => {
    const product: any = productById.get(item.productId);
    return total + (product ? Number(product.sellingPrice) * item.quantity : 0);
  }, 0);
  const balance = Math.max(totalAmount - amountPaid, 0);

  useEffect(() => {
    if (!amountPaidEdited) {
      setAmountPaid(totalAmount);
    }
  }, [amountPaidEdited, totalAmount]);

  const updateItem = (index: number, item: SaleItemDraft) => {
    setItems(items.map((current, currentIndex) => currentIndex === index ? item : current));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saleItems = items
      .filter((item) => item.productId && item.quantity > 0)
      .map((item) => {
        const product: any = productById.get(item.productId);
        return { productId: item.productId, quantity: item.quantity, unitPrice: Number(product.sellingPrice) };
      });

    createSale.mutate({
      customerId: customerId === "walk-in" ? undefined : customerId,
      items: saleItems,
      amountPaid,
      paymentMethod,
      notes,
      saleDate,
    }, {
      onSuccess: () => navigate("/sales"),
    });
  };

  return (
    <CreatePageShell title="Record Sale" description="Build a sale from inventory and post it directly to the API." backTo="/sales">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><ShoppingBag className="w-4 h-4" /> Sale Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Customer</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walk-in">Walk-in customer</SelectItem>
                    {customers.map((customer: any) => <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sale-date">Date</Label>
                <Input id="sale-date" type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => {
                const product: any = productById.get(item.productId);
                const subtotal = product ? Number(product.sellingPrice) * item.quantity : 0;
                return (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_100px_110px_40px] gap-3 items-end rounded-lg border border-border p-3">
                    <div className="space-y-2">
                      <Label>Product</Label>
                      <Select value={item.productId || "none"} onValueChange={(productId) => updateItem(index, { ...item, productId })}>
                        <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                        <SelectContent>
                          {products.map((product: any) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} · ₵{product.sellingPrice} · {product.stockQty} left
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Qty</Label>
                      <Input type="number" min="1" max={product?.stockQty || undefined} required value={item.quantity} onChange={(e) => updateItem(index, { ...item, quantity: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtotal</Label>
                      <Input value={`₵${subtotal.toFixed(2)}`} disabled />
                    </div>
                    <Button type="button" variant="ghost" size="icon" disabled={items.length === 1} onClick={() => setItems(items.filter((_, currentIndex) => currentIndex !== index))}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
              <Button type="button" variant="outline" className="gap-2" onClick={() => setItems([...items, emptyItem])}>
                <Plus className="w-4 h-4" /> Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-secondary p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Total</span><span className="font-semibold">₵{totalAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Customer still owes</span><span className="font-semibold">₵{balance.toFixed(2)}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAmountPaid(totalAmount);
                  setAmountPaidEdited(false);
                  setPaymentMethod(PaymentMethod.CASH);
                }}
              >
                Paid in Full
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAmountPaid(0);
                  setAmountPaidEdited(true);
                  setPaymentMethod(PaymentMethod.CREDIT);
                }}
              >
                Credit Sale
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount-paid">Amount Paid (₵)</Label>
              <Input
                id="amount-paid"
                type="number"
                min="0"
                step="0.01"
                value={amountPaid}
                onChange={(e) => {
                  setAmountPaidEdited(true);
                  setAmountPaid(Number(e.target.value));
                }}
              />
            </div>
            {balance > 0 && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                This sale will appear under Customer Balances because the customer still owes ₵{balance.toFixed(2)}.
              </div>
            )}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(method) => setPaymentMethod(method as PaymentMethod)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentMethod).map((method) => <SelectItem key={method} value={method}>{method.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale-notes">Notes</Label>
              <Textarea id="sale-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button className="w-full" type="submit" disabled={createSale.isPending || totalAmount <= 0}>
              {createSale.isPending ? "Recording..." : "Record Sale"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </CreatePageShell>
  );
}
