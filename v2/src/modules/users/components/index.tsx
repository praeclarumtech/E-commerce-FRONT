import { useMemo, useState } from "react"
import { mdiTableBorder } from "@mdi/js"
import CardBox from "../../_components/CardBox"
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton"
import Table from "../../../shared/components/Table"
import OverlayLayer from "../../_components/OverlayLayer"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createUser, deleteUser, get, updateUser, normalizeUsersListResponse } from "../api"
import type { UserPayload, UsersListApiResponse } from "../api"
import columns from "../columns"
import Button from "../../_components/Button"
import { toast } from "../../_lib/toast"
import type { AxiosError } from "axios"
import type { UserResponse } from "../interface"
import UserForm from "./UserForm"

function Users() {
    const [page, setPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

    const { data: users, refetch } = useQuery({
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

    const createMutation = useMutation({
        mutationFn: (payload: UserPayload) => createUser(payload),
        onSuccess: () => {
            toast.success("User created successfully!");
            setIsFormOpen(false);
            setSelectedUser(null);
            refetch();
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? "Failed to create user");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<UserPayload> }) =>
            updateUser(id, payload),
        onSuccess: () => {
            toast.success("User updated successfully!");
            setIsFormOpen(false);
            setSelectedUser(null);
            refetch();
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? "Failed to update user");
        }
    });

    const handleFormSubmit = (values: UserPayload) => {
        if (selectedUser) {
            const payload = { ...values };
            if (!payload.password) delete payload.password;
            updateMutation.mutate({ id: selectedUser._id, payload });
        } else {
            createMutation.mutate(values);
        }
    };

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
                    onClick={() => {
                        setSelectedUser(null);
                        setIsFormOpen(true);
                    }}
                />
            </SectionTitleLineWithButton>
            <CardBox className="mb-6" hasTable>
                {users && (
                    <Table
                        data={users}
                        columns={userColumns}
                        onPageChange={(pageIndex) => setPage(pageIndex + 1)}
                        onEdit={(row) => {
                            setSelectedUser(row as UserResponse);
                            setIsFormOpen(true);
                        }}
                        deleteMutation={deleteMutation}
                        deleteModalTitle="Delete User"
                        deleteModalMessage="Are you sure you want to delete this user?"
                    />
                )}
            </CardBox>
            {isFormOpen && (
                <OverlayLayer onClick={() => { setIsFormOpen(false); setSelectedUser(null); }}>
                    <div className="flex w-11/12 max-w-md flex-col items-center justify-center">
                        <div className="z-50 w-full animate-fade-in shadow-lg">
                            <UserForm
                                initialValues={selectedUser}
                                onSubmit={handleFormSubmit}
                                onCancel={() => {
                                    setIsFormOpen(false);
                                    setSelectedUser(null);
                                }}
                                isSubmitting={createMutation.isPending || updateMutation.isPending}
                            />
                        </div>
                    </div>
                </OverlayLayer>
            )}
        </>
    )
}

export default Users