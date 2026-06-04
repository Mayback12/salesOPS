import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, LockKeyhole, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await authApi.login({ email, password });
      setAuth(data.data.user, data.token);
      toast.success("Welcome back!");
      navigate("/overview");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid lg:grid-cols-[1fr_480px]">
      <div className="hidden lg:flex flex-col justify-between border-r border-border bg-secondary/50 p-10">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <CircleDollarSign className="w-6 h-6" />
          </div>
          SalesOps
        </div>
        <div className="max-w-xl space-y-6 login-panel-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-accent" />
            Owner dashboard
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-semibold leading-tight">Run sales, stock, expenses, and debts from one clean workspace.</h1>
            <p className="text-muted-foreground text-lg">Built for one owner account with direct API access to your business records.</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Secure access with server configured credentials.</div>
      </div>

      <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md border-border bg-card shadow-xl login-panel-in">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-14 h-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-4 login-mark shadow-lg">
            <LockKeyhole className="w-7 h-7" />
          </div>
          <CardTitle className="text-2xl font-bold">Owner Login</CardTitle>
          <CardDescription>Use the owner credentials configured on the server</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      </div>
    </div>
  );
}
