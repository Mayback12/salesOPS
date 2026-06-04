import { useState } from "react";
import { useInventory } from "@/hooks/use-inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/../../shared/types";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductForm({ open, onOpenChange }: ProductFormProps) {
  const { createProduct } = useInventory();
  const [formData, setFormData] = useState<{
    name: string;
    sku: string;
    category: string;
    costPrice: number;
    sellingPrice: number;
    stockQty: number;
    lowStockAlert: number;
  }>({
    name: "",
    sku: "",
    category: Category.TOPS,
    costPrice: 0,
    sellingPrice: 0,
    stockQty: 0,
    lowStockAlert: 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({
          name: "",
          sku: "",
          category: Category.TOPS,
          costPrice: 0,
          sellingPrice: 0,
          stockQty: 0,
          lowStockAlert: 5,
        });
      },
    });
  };

  const profitMargin = formData.costPrice > 0 
    ? (((formData.sellingPrice - formData.costPrice) / formData.costPrice) * 100).toFixed(1) + '%'
    : '0%';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Category).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price (₵)</Label>
              <Input
                id="costPrice"
                type="number"
                required
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price (₵)</Label>
              <Input
                id="sellingPrice"
                type="number"
                required
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQty">Stock Qty</Label>
              <Input
                id="stockQty"
                type="number"
                required
                value={formData.stockQty}
                onChange={(e) => setFormData({ ...formData, stockQty: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStock">Low Stock Alert</Label>
              <Input
                id="lowStock"
                type="number"
                value={formData.lowStockAlert}
                onChange={(e) => setFormData({ ...formData, lowStockAlert: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="text-sm bg-accent/10 p-2 rounded text-accent font-medium">
            Profit Margin: {profitMargin}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createProduct.isPending}>
              {createProduct.isPending ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
