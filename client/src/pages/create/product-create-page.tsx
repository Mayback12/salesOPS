import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import { Plus } from "lucide-react";
import { useInventory } from "@/hooks/use-inventory";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/../../shared/types";
import { CreatePageShell } from "./create-page-shell";

export function ProductCreatePage() {
  const navigate = useNavigate();
  const { createProduct } = useInventory();
  const { categories, createCategory } = useCategories();
  const [newCategory, setNewCategory] = useState("");
  const [formData, setFormData] = useState<{
    name: string;
    sku: string;
    category: string;
    description: string;
    costPrice: number;
    sellingPrice: number;
    stockQty: number;
    lowStockAlert: number;
  }>({
    name: "",
    sku: "",
    category: Category.TOPS,
    description: "",
    costPrice: 0,
    sellingPrice: 0,
    stockQty: 0,
    lowStockAlert: 5,
  });

  const profit = formData.sellingPrice - formData.costPrice;
  const categoryOptions = categories.length > 0 ? categories.map((category: any) => category.name) : Object.values(Category);

  const handleCreateCategory = () => {
    const name = newCategory.trim().toUpperCase();
    if (!name) return;
    createCategory.mutate(name, {
      onSuccess: () => {
        setFormData({ ...formData, category: name });
        setNewCategory("");
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct.mutate(formData, {
      onSuccess: () => navigate("/inventory"),
    });
  };

  return (
    <CreatePageShell title="Add Product" description="Create inventory with pricing, stock, and alert details." backTo="/inventory">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input id="product-name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-sku">SKU</Label>
                <Input id="product-sku" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(category) => setFormData({ ...formData, category })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category: string) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <div className="space-y-2">
                <Label htmlFor="new-category">New Category</Label>
                <Input
                  id="new-category"
                  placeholder="e.g. BAGS"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="self-end gap-2"
                onClick={handleCreateCategory}
                disabled={createCategory.isPending || !newCategory.trim()}
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description">Description</Label>
              <Textarea id="product-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><PackageCheck className="w-4 h-4" /> Stock & Price</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cost-price">Cost</Label>
                <Input id="cost-price" type="number" min="0" step="0.01" required value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="selling-price">Selling</Label>
                <Input id="selling-price" type="number" min="0" step="0.01" required value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock-qty">Stock</Label>
                <Input id="stock-qty" type="number" min="0" required value={formData.stockQty} onChange={(e) => setFormData({ ...formData, stockQty: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="low-stock">Alert</Label>
                <Input id="low-stock" type="number" min="0" value={formData.lowStockAlert} onChange={(e) => setFormData({ ...formData, lowStockAlert: Number(e.target.value) })} />
              </div>
            </div>
            <div className="rounded-lg bg-secondary p-4 text-sm">
              Profit per item: <span className="font-semibold text-foreground">₵{profit.toFixed(2)}</span>
            </div>
            <Button className="w-full" type="submit" disabled={createProduct.isPending}>
              {createProduct.isPending ? "Creating..." : "Create Product"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </CreatePageShell>
  );
}
