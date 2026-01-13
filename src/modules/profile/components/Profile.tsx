import UserMetaCard from "../../../components/UserProfile/UserMetaCard";
import UserInfoCard from "../../../components/UserProfile/UserInfoCard";

export default function UserProfiles() {
  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="mb-5 text-lg font-semibold text-gray-800">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
        </div>
      </div>
    </>
  );
}
