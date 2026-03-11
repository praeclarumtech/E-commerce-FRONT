import { mdiAccount, mdiGithub } from "@mdi/js";
import Button from "../../_components/Button";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import { useEffect } from "react";
import CardBoxUser from "../../_components/CardBox/User";
import { getPageTitle } from "../../_lib/config";
import PasswordForm from "../../_profile/components/PasswordForm";
import ProfileForm from "../../_profile/components/ProfileForm";

export default function ProfilePage() {
  useEffect(() => {
    document.title = getPageTitle("Profile");
  }, []);
  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiAccount} title="Profile" main>
        <Button
          href="https://github.com/justboil/admin-one-react-tailwind"
          target="_blank"
          icon={mdiGithub}
          label="Star on GitHub"
          color="contrast"
          roundedFull
          small
        />
      </SectionTitleLineWithButton>

      <CardBoxUser className="mb-6" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProfileForm />
        <PasswordForm />
      </div>
    </SectionMain>
  );
}
