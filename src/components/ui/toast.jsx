import { cn } from '@/lib/utils';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import React from 'react';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={cn(
			'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
			className,
		)}
		{...props}
	/>
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
	'data-[swipe=move]:transition-none group relative pointer-events-auto flex w-full items-start gap-3 border border-copa-gold bg-copa-cream p-4 pr-8 text-copa-ink shadow-lg transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full',
	{
		variants: {
			variant: {
				default: 'positive border-l-4 border-l-copa-burgundy',
				destructive: 'destructive border-l-4 border-l-copa-error',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
	return (
		<ToastPrimitives.Root
			ref={ref}
			className={cn(toastVariants({ variant }), className)}
			{...props}
		/>
	);
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}
		className={cn(
			'inline-flex h-8 shrink-0 items-center justify-center border border-copa-gold bg-transparent px-3 font-jost text-xs tracking-wide uppercase transition-colors hover:bg-copa-burgundy hover:text-copa-cream hover:border-copa-burgundy focus:outline-none focus:ring-2 focus:ring-copa-burgundy focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-copa-error/40 group-[.destructive]:hover:border-copa-error group-[.destructive]:hover:bg-copa-error group-[.destructive]:hover:text-copa-cream group-[.destructive]:focus:ring-copa-error',
			className,
		)}
		{...props}
	/>
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}
		className={cn(
			'absolute right-2 top-2 rounded-sm p-1 text-copa-ink/40 opacity-0 transition-opacity hover:text-copa-ink focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-copa-gold group-hover:opacity-100 group-[.destructive]:text-copa-error/60 group-[.destructive]:hover:text-copa-error group-[.destructive]:focus:ring-copa-error',
			className,
		)}
		toast-close=""
		{...props}
	>
		<X className="h-4 w-4" />
	</ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}
		className={cn(
			'text-sm font-semibold group-[.positive]:text-copa-burgundy group-[.destructive]:text-copa-error',
			className,
		)}
		{...props}
	/>
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}
		className={cn('text-sm text-copa-ink/75', className)}
		{...props}
	/>
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
};