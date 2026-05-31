import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/api";

import { getProxiedImageUrl } from "@/lib/media";

interface UserHeaderProps {
  user: User;
}

export function UserHeader({ user }: UserHeaderProps) {
  const initials = user.first_name?.charAt(0) || user.username.charAt(0);
  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-2xl border shadow-sm">
      <Avatar className="h-16 w-16">
        <AvatarImage src={getProxiedImageUrl(user.avatar_url)} />
        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-xl font-bold">
          {user.first_name} {user.last_name}
        </h2>
        <p className="text-muted-foreground">@{user.username}</p>
        {user.company && <p className="text-sm">{user.company}</p>}
        {user.hourly_salary && (
          <p className="text-sm font-medium text-gold">
            R$ {user.hourly_salary}/hora
          </p>
        )}
      </div>
    </div>
  );
}
