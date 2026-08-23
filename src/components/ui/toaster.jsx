import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import React from 'react';

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(({ id, title, description, action, dismiss, variant, ...props }) => {
				const Icon = variant === 'destructive' ? AlertCircle : CheckCircle2;
				const iconColorClass = variant === 'destructive' ? 'text-copa-error' : 'text-copa-burgundy';

				return (
					<Toast
						key={id}
						variant={variant}
						{...props}
						onOpenChange={(open) => {
							if (!open) dismiss();
						}}
					>
						<Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColorClass}`} aria-hidden="true" />
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && (
								<ToastDescription>{description}</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}