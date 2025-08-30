import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome, Github } from "lucide-react";

async function handleGoogleSignIn(){
    "use server";
    await signIn("goolge")

}
async function handleGithubSignIn(){
    "use server";
    await signIn("Github")

}
const SignInFormClient = ()=>{
    return(
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center"> SignIn</CardTitle>
                <CardDescription className="text-center ">
                    Choose Your preferred Sign-in Method
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <form action={handleGoogleSignIn}>
                    <Button type="submit" variant={"outline"} className="w-full">
                        <Chrome className="mr-2 h-4 w-4"/>
                        <span>Sign in with google</span>
                    </Button>
                </form>
                <form action={handleGithubSignIn}>
                    <Button type="submit" variant={"outline"} className="w-full">
                        <Github className="mr-2 h-4 w-4"/>
                        <span>Sign in with Github</span>
                    </Button>
                </form>

            </CardContent>
        </Card>
    )
}

export default SignInFormClient;  