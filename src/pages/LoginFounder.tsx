import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import logo from "@/assets/logo.svg";

export default function LoginFounder() {
  const [email, setEmail] = useState("manish@argosinfotech.com");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login("founder");
    navigate("/");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--gradient-sidebar)" }}
    >
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <img src={logo} alt="Argos" className="h-10 w-auto mx-auto brightness-0 invert mb-3" />
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="p-1.5 rounded-md bg-white/10">
              <User className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Founder Login</h1>
          </div>
          <p className="text-white/60 text-sm">Strategic oversight and approvals</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sign in as Manish</CardTitle>
            <CardDescription className="text-xs">
              Enter your credentials to access the founder dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-9 text-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-9 text-sm font-medium mt-2"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Switch Role Link */}
        <p className="text-center text-xs text-white/50">
          Not a founder?{" "}
          <Link to="/login/dcol" className="text-white/80 hover:text-white underline">
            Login as DCOL
          </Link>
        </p>

        {/* Demo Notice */}
        <p className="text-center text-[10px] text-white/40">
          Demo login — password not required
        </p>
      </div>
    </div>
  );
}
