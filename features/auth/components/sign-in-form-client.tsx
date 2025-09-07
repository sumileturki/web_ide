import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome, Github } from "lucide-react";

async function handleGoogleSignIn() {
  "use server";
  await signIn("google");
}

async function handleGithubSignIn() {
  "use server";
  await signIn("github");
}

const SignInFormClient = () => {
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <Card className="w-[400px] h-[400px] flex flex-col justify-between p-6">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center text-sm text-gray-500">
            Choose your preferred sign-in method
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 justify-center flex-1">
          <form action={handleGoogleSignIn}>
            <Button type="submit" variant={"outline"} className="w-full py-3">
              <Chrome className="mr-2 h-5 w-5" />
              <span>Sign in with Google</span>
            </Button>
          </form>
          <form action={handleGithubSignIn}>
            <Button type="submit" variant={"outline"} className="w-full py-3">
              <Github className="mr-2 h-5 w-5" />
              <span>Sign in with Github</span>
            </Button>
          </form>
        </CardContent>
        <div className="text-center text-xs text-gray-400">
          © 2025 Sumi. All rights reserved.
        </div>
      </Card>
    </div>
  );
};

export default SignInFormClient;
