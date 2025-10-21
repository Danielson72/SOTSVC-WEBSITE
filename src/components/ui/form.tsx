import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function FormError({ message }: { message: string }) {
  return (
    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
      {message}
    </div>
  );
}

export function FormField({
  label,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { label: string }) {
  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}