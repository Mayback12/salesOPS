import { useEffect, useState } from "react";
import { useInventory } from "@/hooks/use-inventory";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductEditDialogProps {
  product: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductEditDialog({ product, open, onOpenChange }: ProductEditDialogProps) {
  const { updateProduct } = useInventory();
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "OTHER",
    costPrice: 0,
    sellingPrice: 0,
    stockQty: 0,
    lowStockAlert: 5,
  });

  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "OTHER",
        costPrice: Number(product.costPrice) || 0,
        sellingPrice: Number(product.sellingPrice) || 0,
        stockQty: Number(product.stockQty) || 0,
        lowStockAlert: Number(product.lowStockAlert) || 5,
      });
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    updateProduct.mutate({ id: product.id, data: formData }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>Name</Label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>SKU</Label>
            <Input value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(category) => setFormData({ ...formData, category })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[...new Set([formData.category, ...categories.map((category: any) => category.name), "OTHER"])].map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Cost Price</Label>
            <Input type="number" min="0" step="0.01" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>Selling Price</Label>
            <Input type="number" min="0" step="0.01" value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>Stock</Label>
            <Input type="number" min="0" value={formData.stockQty} onChange={(e) => setFormData({ ...formData, stockQty: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>Low Stock Alert</Label>
            <Input type="number" min="0" value={formData.lowStockAlert} onChange={(e) => setFormData({ ...formData, lowStockAlert: Number(e.target.value) })} />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" disabled={updateProduct.isPending}>{updateProduct.isPending ? "Saving..." : "Save Product"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
