import { mdiAccount, mdiGithub } from '@mdi/js'

import SectionTitleLineWithButton from '../../../_components/Section/TitleLineWithButton'
import Button from '../../../_components/Button'
import CardBoxUser from '../../../_components/CardBox/User'
import ProfileForm from './ProfileForm'
import PasswordForm from './PasswordForm'

function Profile() {
    return (
        <>
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
        </>
    )
}

export default Profile