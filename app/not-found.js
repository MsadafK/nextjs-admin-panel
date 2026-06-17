import { Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      {/* Large 404 */}
      <div className="relative mb-8">
        <h1 className="text-[10rem] sm:text-[14rem] font-bold leading-none tracking-tighter text-foreground/5 select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-2">
            <p className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Page not found
            </p>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium
            bg-foreground text-background rounded-md
            hover:opacity-90 transition-opacity"
        >
          <Home size={16} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
