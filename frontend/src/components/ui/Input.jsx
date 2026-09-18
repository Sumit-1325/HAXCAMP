import { cn } from '../../lib/cn.js';
import { Field, fieldControlClass, useFieldId } from './Field.jsx';

export function Input({ label, error, hint, id, className, required, ...props }) {
  const fieldId = useFieldId(id);

  return (
    <Field id={fieldId} label={label} error={error} hint={hint} required={required}>
      <input
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(fieldControlClass(Boolean(error)), 'h-11 px-3.5', className)}
        {...props}
      />
    </Field>
  );
}

export function Textarea({ label, error, hint, id, className, required, rows = 4, ...props }) {
  const fieldId = useFieldId(id);

  return (
    <Field id={fieldId} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={fieldId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(fieldControlClass(Boolean(error)), 'px-3.5 py-2.5', className)}
        {...props}
      />
    </Field>
  );
}

export function Select({ label, error, hint, id, className, required, children, ...props }) {
  const fieldId = useFieldId(id);

  return (
    <Field id={fieldId} label={label} error={error} hint={hint} required={required}>
      <select
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(fieldControlClass(Boolean(error)), 'h-11 px-3', className)}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
}
