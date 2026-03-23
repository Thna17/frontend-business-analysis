import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/domain";

interface RecentUsersCardProps {
  users: User[];
}

export function RecentUsersCard({ users }: RecentUsersCardProps) {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent User Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <Badge variant="outline">{user.role}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
