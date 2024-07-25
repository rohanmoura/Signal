import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isRouteActivePath(currentPath: string, targetPath: string) {
  if (targetPath === '/') {
    return currentPath === '/' || currentPath.includes('chats');
  }

  return currentPath === targetPath || currentPath.includes(targetPath);
}