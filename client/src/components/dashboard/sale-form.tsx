import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCustomers } from "@/hooks/use-customers";
import { useInventory } from "@/hooks/use-inventory";
import { useSales } from "@/hooks/use-sales";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentMethod } from "@/../../shared/types";

interface SaleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SaleItemDraft {
  productId: string;
  quantity: number;
}

const emptyItem = { productId: "", quantity: 1 };

export function SaleForm({ open, onOpenChange }: SaleFormProps) {
  const { products } = useInventory();
  const { customers } = useCustomers();
  const { createSale } = useSales();
  const [customerId, setCustomerId] = useState("walk-in");
  const [items, setItems] = useState<SaleItemDraft[]>([emptyItem]);
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CASH);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const productById = useMemo(() => {
    return new Map(products.map((product: any) => [product.id, product]));
  }, [products]);

  const totalAmount = items.reduce((total, item) => {
    const product: any = productById.get(item.productId);
    return total + (product ? Number(product.sellingPrice) * item.quantity : 0);
  }, 0);

  const resetForm = () => {
    setCustomerId("walk-in");
    setItems([emptyItem]);
    setAmountPaid(0);
    setPaymentMethod(PaymentMethod.CASH);
    setSaleDate(new Date().toISOString().slice(0, 10));
    setNotes("");
  };

  const updateItem = (index: number, item: SaleItemDraft) => {
    setItems(items.map((current, currentIndex) => currentIndex === index ? item : current));
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const saleItems = items
      .filter((item) => item.productId && item.quantity > 0)
      .map((item) => {
        const product: any = productById.get(item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: Number(product.sellingPrice),
        };
      });

    createSale.mutate(
      {
        customerId: customerId === "walk-in" ? undefined : customerId,
        items: saleItems,
        amountPaid,
        paymentMethod,
        notes,
        saleDate,
      },
      {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Sale</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label>Customer</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walk-in">Walk-in customer</SelectItem>
                  {customers.map((customer: any) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale-date">Date</Label>
              <Input
                id="sale-date"
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setItems([...items, emptyItem])}
              >
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>
            {items.map((item, index) => {
              const product: any = productById.get(item.productId);
              const stockQty = product?.stockQty ?? 0;
              return (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_96px_96px_40px] gap-3 items-end">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select
                      value={item.productId || "none"}
                      onValueChange={(productId) => updateItem(index, { ...item, productId })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
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
                    <Input
                      type="number"
                      min="1"
                      max={stockQty || undefined}
                      required
                      value={item.quantity}
                      onChange={(e) => updateItem(index, { ...item, quantity: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtotal</Label>
                    <Input
                      value={`₵${(product ? Number(product.sellingPrice) * item.quantity : 0).toFixed(2)}`}
                      disabled
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Total</Label>
              <Input value={`₵${totalAmount.toFixed(2)}`} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount-paid">Amount Paid (₵)</Label>
              <Input
                id="amount-paid"
                type="number"
                min="0"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentMethod).map((method) => (
                    <SelectItem key={method} value={method}>
                      {method.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sale-notes">Notes</Label>
            <Textarea id="sale-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createSale.isPending || totalAmount <= 0}>
              {createSale.isPending ? "Recording..." : "Record Sale"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
