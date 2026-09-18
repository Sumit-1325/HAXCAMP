import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '../ui/Button.jsx';
import { Input, Select, Textarea } from '../ui/Input.jsx';
import { Modal } from '../ui/Modal.jsx';
import { createProduct, updateProduct } from '../../api/products.js';
import { useToast } from '../../context/ToastContext.jsx';
import { CATEGORIES } from '../../lib/constants.js';
import { validateProduct } from '../../lib/validation.js';

const EMPTY_PRODUCT = {
  name: '',
  category: CATEGORIES[0],
  price: '',
  stock: '',
  image: '',
  description: '',
};

const toFormValues = (product) =>
  product
    ? {
        name: product.name,
        category: product.category,
        price: String(product.price),
        stock: String(product.stock),
        image: product.image ?? '',
        description: product.description ?? '',
      }
    : EMPTY_PRODUCT;

export function ProductFormModal({ isOpen, product, onClose, onSaved }) {
  const isEditing = Boolean(product);
  const toast = useToast();

  const [values, setValues] = useState(EMPTY_PRODUCT);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset whenever the dialog opens so a cancelled edit never leaks into the
  // next one.
  useEffect(() => {
    if (!isOpen) return;
    setValues(toFormValues(product));
    setErrors({});
    setSubmitError(null);
  }, [isOpen, product]);

  const updateField = (field) => (event) => {
    const { value } = event.target;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    const nextErrors = validateProduct(values);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(`product-${firstInvalid}`)?.focus();
      return;
    }

    // Numbers are cast here so the API receives the same types it validates.
    const payload = {
      name: values.name.trim(),
      category: values.category,
      price: Number(values.price),
      stock: Number(values.stock),
      image: values.image.trim(),
      description: values.description.trim(),
    };

    setIsSubmitting(true);
    try {
      const saved = isEditing
        ? await updateProduct(product._id, payload)
        : await createProduct(payload);

      toast.success(isEditing ? `${saved.name} updated` : `${saved.name} created`);
      onSaved?.(saved);
      onClose();
    } catch (error) {
      setSubmitError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={isEditing ? 'Edit product' : 'New product'}
      description={
        isEditing
          ? 'Changes apply to the storefront immediately.'
          : 'Add an item to the catalogue. It goes live as soon as you save.'
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="product-form" isLoading={isSubmitting} disabled={isSubmitting}>
            {isEditing ? 'Save changes' : 'Create product'}
          </Button>
        </>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} noValidate className="space-y-5">
        {submitError ? (
          <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Could not save the product</p>
              <p className="mt-1 text-sm text-red-700">{submitError.message}</p>
            </div>
          </div>
        ) : null}

        <Input
          id="product-name"
          label="Name"
          required
          value={values.name}
          onChange={updateField('name')}
          error={errors.name}
          placeholder="Aurora Wireless Headphones"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            id="product-category"
            label="Category"
            required
            value={values.category}
            onChange={updateField('category')}
            error={errors.category}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>

          <Input
            id="product-price"
            type="number"
            min="0"
            step="0.01"
            label="Price (₹)"
            required
            value={values.price}
            onChange={updateField('price')}
            error={errors.price}
            placeholder="8999"
          />

          <Input
            id="product-stock"
            type="number"
            min="0"
            step="1"
            label="Stock"
            required
            value={values.stock}
            onChange={updateField('stock')}
            error={errors.stock}
            placeholder="24"
          />
        </div>

        <Input
          id="product-image"
          label="Image URL"
          value={values.image}
          onChange={updateField('image')}
          error={errors.image}
          hint="No uploads — paste a hosted image URL."
          placeholder="https://images.example.com/product.jpg"
        />

        <Textarea
          id="product-description"
          label="Description"
          rows={4}
          value={values.description}
          onChange={updateField('description')}
          error={errors.description}
          placeholder="What makes this worth buying?"
        />
      </form>
    </Modal>
  );
}
