import { Badge } from '@/components/ui/badge';
import type { User } from '@/lib/types';
import { AuthButton } from './AuthButton';
import { ThemeToggle } from './ThemeToggle';

// Updated Star Icon
const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#FFD700" stroke="#FFC700"/>
    </svg>
)

// Updated Award Icon
const AwardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="8" r="6" fill="#C0C0C0" stroke="#A9A9A9" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" fill="#E5E4E2" stroke="#D3D3D3"/>
    </svg>
)

type Props = { user: User | null };

export function DashboardHeader({ user }: Props) {

  return (
    <header className="rounded-xl bg-gradient-to-r from-primary to-blue-400 text-primary-foreground p-6 md:p-8 shadow-lg">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold font-headline">
            Welcome back!
          </h1>
          <p className="text-primary-foreground/80 mt-1">Here's your progress for today.</p>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <Badge variant="outline" className="h-fit text-sm capitalize py-1 px-3 bg-white/20 text-white border-white/30 w-fit">
              {user.tier.toLowerCase()}
            </Badge>
          )}
          <ThemeToggle />
          <AuthButton user={user} />
        </div>
      </div>
      {user && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div 
            className="group relative flex items-center gap-3 py-3 px-4 rounded-lg bg-white/20 backdrop-blur-sm cursor-pointer"
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              <span className={`absolute text-3xl transition-transform duration-300 group-hover:animate-burn`}>🔥</span>
            </div>
            <div className="pl-4">
              <p className="font-bold text-lg">{user.streak} days</p>
              <p className="text-xs opacity-80">Streak</p>
            </div>
          </div>
          <div className="group flex items-center gap-3 py-3 px-4 rounded-lg bg-white/20 backdrop-blur-sm cursor-pointer">
            <StarIcon className="h-6 w-6 transition-transform duration-300 group-hover:animate-shine" />
            <div>
              <p className="font-bold text-lg">{user.conversationsToday}/{user.conversationsLimit}</p>
              <p className="text-xs opacity-80">Used</p>
            </div>
          </div>
          <div className="group flex items-center gap-3 py-3 px-4 rounded-lg bg-white/20 backdrop-blur-sm col-span-2 md:col-span-1 cursor-pointer">
              <AwardIcon className="h-6 w-6 transition-transform duration-300 group-hover:animate-gleam" />
              <div>
                  <p className="font-bold text-lg">{user.level}</p>
                  <p className="text-xs opacity-80">Level</p>
              </div>
          </div>
        </div>
      )}
    </header>
  );
}
