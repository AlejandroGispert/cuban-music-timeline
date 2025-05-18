import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Mail, Lock, Key } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Signup form schema
const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  accessCode: z.string().min(1, "Access code is required"),
});

const Authentication = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error, login, signup, checkAuth } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("login");

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      const isAuthed = await checkAuth();
      if (isAuthed || isAuthenticated) {
        const redirectPath = user?.role === "admin" ? "/admin" : "/";
        navigate(redirectPath);
      }
    };

    checkAuthStatus();
  }, [isAuthenticated, navigate, user, checkAuth]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Signup form
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      accessCode: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setAuthError(null);
    const success = await login(values.email, values.password);

    if (success) {
      toast({
        title: "Login successful",
        description: `Welcome back, ${values.email}!`,
      });

      // Navigate based on role
      if (user?.role === "admin" || user?.role === "editor") {
        navigate("/admin");
      }
    } else {
      setAuthError(error || "Authentication failed");
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setAuthError(null);
    const success = await signup(values.email, values.password, values.accessCode);

    if (success) {
      toast({
        title: "Signup successful",
        description: `Welcome, ${values.email}!`,
      });

      // Navigate based on role
      if (user?.role === "admin" || user?.role === "editor") {
        navigate("/admin");
      }
    } else {
      setAuthError(error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-cuba-red flex items-center justify-center mb-3">
            <span className="text-white text-xl font-bold">RC</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cuba-red to-cuba-blue bg-clip-text text-transparent">
            Ritmos Cubanos
          </CardTitle>
          <CardDescription>Access the system to manage events</CardDescription>
        </CardHeader>

        <CardContent>
          {authError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-background">
                            <Mail className="ml-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="email@example.com"
                              className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-background">
                            <Lock className="ml-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-background">
                            <Mail className="ml-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="email@example.com"
                              className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-background">
                            <Lock className="ml-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="accessCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Code</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-background">
                            <Key className="ml-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter your access code"
                              className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing up..." : "Sign Up"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="border-t p-4">
          <div className="w-full text-center text-sm text-muted-foreground">
            <p>Contact the administrator to get an access code</p>
            <div className="mt-2 text-xs">
              <p className="mb-1">Password requirements:</p>
              <ul className="list-disc list-inside">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Authentication;
