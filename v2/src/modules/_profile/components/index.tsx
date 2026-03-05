import { mdiAccount } from '@mdi/js'

import ProfileForm from './ProfileForm'
import PasswordForm from './PasswordForm'
import SectionTitleLineWithButton from '../../_components/Section/TitleLineWithButton'
import CardBoxUser from '../../_components/CardBox/User'

function Profile() {
    return (
        <>
            <SectionTitleLineWithButton icon={mdiAccount} title="Profile" main >
                <></>
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