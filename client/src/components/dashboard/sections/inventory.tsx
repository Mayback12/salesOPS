import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInventory } from "@/hooks/use-inventory";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CategoryForm } from "@/components/dashboard/category-form";
import { ProductEditDialog } from "@/components/dashboard/product-edit-dialog";
import { Plus, Search, Package, AlertTriangle, Tags } from "lucide-react";

export function InventorySection() {
  const navigate = useNavigate();
  const { products, isLoading } = useInventory();
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [productEditOpen, setProductEditOpen] = useState(false);

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Inventory</h2>
          <p className="text-muted-foreground">Manage your products and stock levels</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setCategoryFormOpen(true)}
          >
            <Tags className="w-4 h-4" />
            Add Category
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            onClick={() => navigate("/inventory/new")}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Tags className="w-4 h-4" />
            Product Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {categories.length === 0 ? (
              <span className="text-sm text-muted-foreground">No categories yet. Use Add Category to create one.</span>
            ) : (
              categories.map((category: any) => (
                <Badge key={category.id} variant="secondary" className="px-3 py-1">
                  {category.name}
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search products by name or SKU..."
          className="border-none bg-transparent focus-visible:ring-0 px-0 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="text-base font-semibold">Product List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      Loading inventory...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product: any) => (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center text-accent">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.sku || 'No SKU'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize">{product.category.toLowerCase()}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">₵{product.sellingPrice}</div>
                        <div className="text-xs text-muted-foreground">Cost: ₵{product.costPrice}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={product.stockQty <= product.lowStockAlert ? 'text-destructive font-bold' : 'text-foreground'}>
                            {product.stockQty}
                          </span>
                          {product.stockQty <= product.lowStockAlert && (
                            <AlertTriangle className="w-4 h-4 text-warning" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product);
                            setProductEditOpen(true);
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
      <CategoryForm open={categoryFormOpen} onOpenChange={setCategoryFormOpen} />
      <ProductEditDialog
        product={selectedProduct}
        open={productEditOpen}
        onOpenChange={setProductEditOpen}
      />
    </div>
  );
}
