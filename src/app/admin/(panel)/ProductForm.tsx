import type { Category, Product, ProductImage, Variant } from "@/db/schema";
import { paiseToRupees } from "@/lib/format";
import { saveProduct } from "@/lib/actions/admin";
import { Card, Check, Field, Select, TextArea } from "@/components/admin/ui";
import { ActionForm, ImageListInput, SubmitButton, VariantsEditor } from "@/components/admin/client";

const COMMON_TAGS = [
  ["bestseller", "Bestseller"],
  ["new", "New arrival"],
  ["gift", "Gift store"],
  ["her", "For her"],
  ["mom", "For mom"],
  ["self", "For you"],
  ["bridal", "Bridal"],
  ["wedding", "Wedding"],
  ["festive", "Festive"],
  ["everyday", "Everyday"],
] as const;

export function ProductForm({
  product,
  images,
  variants,
  categories,
}: {
  product?: Product;
  images: ProductImage[];
  variants: Variant[];
  categories: Category[];
}) {
  const tags = (product?.tags ?? "").split(",").filter(Boolean);
  const extra = tags.filter((t) => !COMMON_TAGS.some(([k]) => k === t));
  return (
    <ActionForm action={saveProduct} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <div className="space-y-6">
        <Card title="Basics">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Product name" name="name" defaultValue={product?.name} required className="sm:col-span-2" />
            <Field label="URL slug" name="slug" defaultValue={product?.slug} hint="Leave blank to generate from the name." />
            <Field label="SKU" name="sku" defaultValue={product?.sku} required />
            <Field label="Selling price (₹, incl. GST)" name="price" type="number" step="0.01" defaultValue={paiseToRupees(product?.price)} required hint="Automatic offers are applied on top of this price." />
            <Field label="MRP / compare-at price (₹)" name="compareAtPrice" type="number" step="0.01" defaultValue={paiseToRupees(product?.compareAtPrice)} hint="Optional. Shown struck-through when higher than the selling price." />
          </div>
          <TextArea label="Description" name="description" defaultValue={product?.description} rows={6} className="mt-4" hint="Separate paragraphs with a blank line." />
        </Card>
        <Card title="Images">
          <ImageListInput name="images" defaultValue={images.map((i) => i.url)} label="Product photos (first = main, second = hover image)" />
        </Card>
        <Card title="Options & stock">
          <VariantsEditor
            initial={variants.map((v) => ({ id: v.id, title: v.title, sku: v.sku ?? "", delta: paiseToRupees(v.priceDelta) || "0", stock: String(v.stock) }))}
          />
        </Card>
        <Card title="Details">
          <div className="grid gap-4 sm:grid-cols-3">
            <Select label="Metal" name="metal" defaultValue={product?.metal ?? "Silver"} options={["Silver", "Gold", "Rose Gold", "Platinum"].map((m) => ({ value: m, label: m }))} />
            <Field label="Purity" name="purity" defaultValue={product?.purity} placeholder="925 Sterling Silver / 22K Gold" />
            <Field label="Finish / polish" name="finish" defaultValue={product?.finish} placeholder="Silver Polish, Rose Gold Polish…" />
            <Select label="Gender" name="gender" defaultValue={product?.gender ?? "Women"} options={["Women", "Men", "Unisex", "Kids"].map((m) => ({ value: m, label: m }))} />
            <Field label="Stone" name="stone" defaultValue={product?.stone} />
            <Field label="Approx. weight (g)" name="weightGrams" type="number" step="0.01" defaultValue={product?.weightGrams ?? ""} />
            <Field label="Dimensions" name="dimensions" defaultValue={product?.dimensions} className="sm:col-span-3" placeholder="e.g. Chain 45 cm + 5 cm extender" />
          </div>
          <TextArea label="Care instructions (optional)" name="careInstructions" defaultValue={product?.careInstructions} rows={3} className="mt-4" hint="Leave blank to show the standard jewellery care guide." />
        </Card>
        <Card title="SEO">
          <div className="grid gap-4">
            <Field label="SEO title" name="seoTitle" defaultValue={product?.seoTitle} />
            <TextArea label="SEO description" name="seoDescription" defaultValue={product?.seoDescription} rows={2} />
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card title="Publish">
          <div className="space-y-3">
            <Check label="Listed (visible on the website)" name="isActive" defaultChecked={product ? product.isActive : true} />
            <Check label="Sample product" name="isSample" defaultChecked={product?.isSample ?? false} hint="Untick once real photos, price & stock are in." />
          </div>
          <SubmitButton className="mt-5 w-full">Save product</SubmitButton>
        </Card>
        <Card title="Organisation">
          <Select
            label="Category"
            name="categoryId"
            defaultValue={product?.categoryId ?? ""}
            options={[{ value: "", label: "— None —" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
          />
          <p className="label mt-4">Tags</p>
          <div className="grid grid-cols-2 gap-2">
            {COMMON_TAGS.map(([k, l]) => (
              <label key={k} className="flex items-center gap-2 text-[14px]">
                <input type="checkbox" name="tag" value={k} defaultChecked={tags.includes(k)} className="h-4 w-4 accent-ink" />
                {l}
              </label>
            ))}
          </div>
          <Field label="Other tags (comma separated)" name="extraTags" defaultValue={extra.join(", ")} className="mt-4" />
        </Card>
        {product && (
          <Card title="Reference">
            <p className="text-[12px] break-all text-subtle">Product ID: {product.id}</p>
          </Card>
        )}
      </div>
    </ActionForm>
  );
}
