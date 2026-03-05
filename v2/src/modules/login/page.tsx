import { useEffect } from "react";
import CardBox from "../_components/CardBox";
import SectionFullScreen from "../_components/Section/FullScreen";
import { getPageTitle } from "../_lib/config";
import LoginForm from "./_components/LoginForm";

const LoginPage = () => {
  useEffect(() => {
    document.title = getPageTitle("Login");
  }, []);
  return (
    <SectionFullScreen bg="purplePink">
      <CardBox className="w-11/12 shadow-2xl md:w-7/12 lg:w-6/12 xl:w-4/12">
        <LoginForm />
      </CardBox>
    </SectionFullScreen>
  );
};

export default LoginPage;
