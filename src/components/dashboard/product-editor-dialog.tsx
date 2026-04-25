import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ProductFormState {
  name: string;
  category: string;
  newCategory: string;
  categoryMode: "existing" | "new";
  unitPrice: string;
  stock: string;
  isActive: boolean;
}

interface ProductEditorDialogProps {
  open: boolean;
  isSaving: boolean;
  editingProductName?: string | null;
  form: ProductFormState;
  categoryOptions: string[];
  formError?: string | null;
  onOpenChange: (open: boolean) => void;
  onFormChange: (next: ProductFormState) => void;
  onSubmit: () => void;
}

export function ProductEditorDialog({
  open,
  isSaving,
  editingProductName,
  form,
  categoryOptions,
  formError,
  onOpenChange,
  onFormChange,
  onSubmit,
}: ProductEditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[96vh] max-w-[800px] overflow-y-auto rounded-2xl border border-border p-0 shadow-[0_20px_48px_rgba(15,23,42,0.18)]"
      >
        <DialogHeader className="flex-row items-center justify-between border-b border-border bg-surface-subtle px-6 py-4 text-left">
          <div className="space-y-1">
            <DialogTitle className="text-[1.625rem] font-semibold tracking-tight text-foreground">
              {editingProductName ? "Update Product" : "Add New Product"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {editingProductName
                ? `Update ${editingProductName} so product analytics and sales sync stay accurate.`
                : "Create a product record with category, pricing, and stock details that match your reporting model."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            disabled={isSaving}
            aria-label="Close product dialog"
          >
            <X className="size-5" />
          </button>
        </DialogHeader>

        <div className="dashboard-form-grid px-6 py-6">
          <section className="dashboard-form-section">
            <div className="space-y-1">
              <p className="dashboard-form-section-title">Core product details</p>
              <p className="dashboard-form-helper">
                Keep names, category structure, and pricing consistent so sales sync and reporting stay reliable.
              </p>
            </div>

            <div className="dashboard-form-field">
              <label className="text-sm font-medium text-secondary-foreground" htmlFor="product-name">
                Product Name
              </label>
              <Input
                id="product-name"
                value={form.name}
                onChange={(event) => onFormChange({ ...form, name: event.target.value })}
                placeholder="e.g. Enterprise License"
                className="h-11 rounded-xl border-border bg-card text-sm text-secondary-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="dashboard-form-grid-two">
              <div className="dashboard-form-field">
                <label className="text-sm font-medium text-secondary-foreground" htmlFor="category-mode">
                  Category
                </label>
                <Select
                  value={form.categoryMode}
                  onValueChange={(value) => onFormChange({ ...form, categoryMode: value as "existing" | "new" })}
                >
                  <SelectTrigger id="category-mode" className="h-11 rounded-xl border-border bg-card text-sm text-secondary-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="existing">Select Existing Category</SelectItem>
                    <SelectItem value="new">Add New Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.categoryMode === "existing" ? (
                <div className="dashboard-form-field">
                  <label className="text-sm font-medium text-secondary-foreground" htmlFor="category-select">
                    Existing Category
                  </label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => onFormChange({ ...form, category: value })}
                  >
                    <SelectTrigger id="category-select" className="h-11 rounded-xl border-border bg-card text-sm text-secondary-foreground">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="dashboard-form-field">
                  <label className="text-sm font-medium text-secondary-foreground" htmlFor="new-category">
                    New Category Name
                  </label>
                  <Input
                    id="new-category"
                    value={form.newCategory}
                    onChange={(event) => onFormChange({ ...form, newCategory: event.target.value })}
                    placeholder="e.g. Bakery"
                    className="h-11 rounded-xl border-border bg-card text-sm text-secondary-foreground"
                  />
                </div>
              )}
            </div>

            <div className="dashboard-form-grid-two">
              <div className="dashboard-form-field">
                <label className="text-sm font-medium text-secondary-foreground" htmlFor="unit-price">
                  Price ($)
                </label>
                <Input
                  id="unit-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.unitPrice}
                  onChange={(event) => onFormChange({ ...form, unitPrice: event.target.value })}
                  className="h-11 rounded-xl border-border bg-card text-sm text-secondary-foreground"
                />
              </div>
              <div className="dashboard-form-field">
                <label className="text-sm font-medium text-secondary-foreground" htmlFor="stock">
                  Stock
                </label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  step="1"
                  value={form.stock}
                  onChange={(event) => onFormChange({ ...form, stock: event.target.value })}
                  className="h-11 rounded-xl border-border bg-card text-sm text-secondary-foreground"
                />
              </div>
            </div>
          </section>

          <div className="dashboard-inline-feedback dashboard-inline-feedback-info">
            <p>Archived products remain available for historical reporting. Use consistent categories to avoid duplicate product suggestions from sales imports.</p>
          </div>

          {formError ? (
            <div className="dashboard-inline-feedback dashboard-inline-feedback-danger" role="alert">
              <p>{formError}</p>
            </div>
          ) : null}

          <div className="dashboard-form-actions">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl px-6 text-sm"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="dark"
              className="h-10 rounded-xl px-7 text-sm"
              onClick={onSubmit}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : editingProductName ? "Save Product" : "Add Product"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
