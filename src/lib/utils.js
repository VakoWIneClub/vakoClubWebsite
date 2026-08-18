import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

// Single source of truth for "is this user an admin" — 'admin' and 'superadmin' are both
// admin-equivalent throughout the app. Was previously checked ad hoc per file; some call sites
// checked only 'admin' and silently excluded superadmins from every admin control in that
// section, so all checks now go through this one helper instead of being re-derived inline.
export function isAdminUser(user) {
	return !!user && (user.role === 'admin' || user.role === 'superadmin');
}