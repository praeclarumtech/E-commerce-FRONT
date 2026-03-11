import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mdiTableBorder } from "@mdi/js";
import CardBox from "../../_components/CardBox";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import Table from "../../../shared/components/Table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteUser, get, normalizeUsersListResponse } from "../api";
import type { UsersListApiResponse } from "../api";
import columns from "../columns";
import Button from "../../_components/Button";
import { toast } from "../../_lib/toast";
import type { AxiosError } from "axios";
import type { UserResponse } from "../interface";

function Users() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const { data: users, refetch, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['users', page],
        queryFn: () => get({ params: { page, limit: 10 } }),
        select: (response) => {
            const body = response.data as UsersListApiResponse | { data?: UsersListApiResponse };
            const raw = body && "items" in body ? body : body?.data;
            if (!raw || !Array.isArray(raw.items)) return undefined;
            return normalizeUsersListResponse(raw);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            toast.success("User deleted successfully!");
            refetch();
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? "Failed to delete user");
        }
    });

    const userColumns = useMemo(() => columns(), [users]);

    return (
        <>
            <SectionTitleLineWithButton icon={mdiTableBorder} title="Users" main>
                <Button
                    type="button"
                    label="Add User"
                    color="info"
                    className="py-3 font-medium"
                    small
                    onClick={() => navigate("/users/add")}
                />
            </SectionTitleLineWithButton>
            <CardBox className="mb-6" hasTable>
                {isLoadingUsers ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-b-blue-600 border-gray-200 dark:border-slate-700" />
                    </div>
                ) : users && users.items?.length > 0 ? (
                    <Table
                        data={users}
                        columns={userColumns}
                        onPageChange={(pageIndex) => setPage(pageIndex + 1)}
                        onEdit={(row) => navigate(`/users/edit/${(row as UserResponse)._id}`)}
                        deleteMutation={deleteMutation}
                        deleteModalTitle="Delete User"
                        deleteModalMessage="Are you sure you want to delete this user?"
                    />
                ) : (
                    <div className="py-12 text-center text-gray-500 dark:text-slate-400">
                        No users yet. Click &quot;Add User&quot; to create one.
                    </div>
                )}
            </CardBox>
        </>
    );
}

export default Users;
