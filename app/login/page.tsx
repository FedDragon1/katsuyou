import { FC, Suspense } from "react";
import LandingNav from "@/components/LandingNav";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";
import ErrorMessage from "@/components/ErrorMessage";

const LoginPage: FC = async () => {
    return (
        <>
            <Suspense>
                <ErrorMessage />
            </Suspense>
            <div className={"h-[40vh] sm:h-[60vh] sm:min-h-[400px]"}>
                <LandingNav hideOptions sticky/>
            </div>
            <div className={"w-full"}>
                <LoginForm />
            </div>
            <Footer/>
        </>
    )
}

export default LoginPage