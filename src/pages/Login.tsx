import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Headset } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";

export default function Login() {
  const roles = [
    {
      id: "founder",
      title: "Founder",
      description: "Strategic oversight, approvals, and high-level decisions",
      icon: User,
      user: "Manish",
      path: "/login/founder",
    },
    {
      id: "dcol",
      title: "Delivery Coordinator",
      description: "Day-to-day operations, client management, and execution",
      icon: Headset,
      user: "Sarah Chen",
      path: "/login/dcol",
    },
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--gradient-sidebar)" }}
    >
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <img src={logo} alt="Argos" className="h-10 w-auto mx-auto brightness-0 invert mb-3" />
          <h1 className="text-xl font-bold text-white">Welcome to Argos</h1>
          <p className="text-white/60 text-sm mt-1">Select your role to continue</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          {roles.map((role) => (
            <Link key={role.id} to={role.path}>
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
                  "border-transparent bg-card hover:border-accent/50"
                )}
              >
                <CardHeader className="pb-2 py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <role.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{role.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">Login as {role.user}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-4 pt-0">
                  <CardDescription className="text-xs">
                    {role.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Demo Notice */}
        <p className="text-center text-[10px] text-white/40">
          Demo login — select a role to explore the interface
        </p>
      </div>
    </div>
  );
}
