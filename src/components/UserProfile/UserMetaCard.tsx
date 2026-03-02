import { useUser } from "../../context/UserDataContext";
import generateAvatarColors from "../../shared/utils/avatar";

export default function UserMetaCard() {
  const { user } = useUser()

  const { backgroundColor, color } = generateAvatarColors(user?.firstName + ' ' + user?.lastName);
  const initials = `${user?.firstName[0] ?? ""}${user?.lastName[0] ?? ""}`.toUpperCase();

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div
              style={{ backgroundColor, color }}
              className="w-20 h-20 text-xl font-medium overflow-hidden border border-gray-200 rounded-full flex items-center justify-center">
              {initials}
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user?.firstName} {user?.lastName}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.role.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
