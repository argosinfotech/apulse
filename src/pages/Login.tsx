import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole, useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Headset } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole);
      navigate("/");
    }
  };

  const roles = [
    {
      id: "founder" as UserRole,
      title: "Founder",
      description: "Strategic oversight, approvals, and high-level decisions",
      icon: Crown,
      user: "Manish",
    },
    {
      id: "dcol" as UserRole,
      title: "DCOL",
      description: "Day-to-day operations, client management, and execution",
      icon: Headset,
      user: "Sarah Chen",
    },
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--gradient-sidebar)" }}
    >
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <img src={logo} alt="Argos" className="h-12 w-auto mx-auto brightness-0 invert mb-4" />
          <h1 className="text-2xl font-bold text-white">Welcome to Argos</h1>
          <p className="text-white/70 mt-2">Select your role to continue</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
                selectedRole === role.id
                  ? "border-accent bg-accent/5 shadow-lg"
                  : "border-transparent bg-card hover:border-accent/50"
              )}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2.5 rounded-lg",
                    selectedRole === role.id ? "bg-accent text-accent-foreground" : "bg-muted"
                  )}>
                    <role.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">Logging in as {role.user}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {role.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Login Button */}
        <Button
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base font-medium"
          disabled={!selectedRole}
          onClick={handleLogin}
        >
          Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title : "..."}
        </Button>

        {/* Demo Notice */}
        <p className="text-center text-sm text-white/50">
          This is a demo login. Select a role to explore the interface.
        </p>
      </div>
    </div>
  );
}
