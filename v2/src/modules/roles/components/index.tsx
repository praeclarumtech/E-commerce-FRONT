import { useMemo, useState } from "react"
import { mdiTableBorder } from "@mdi/js"
import CardBox from "../../_components/CardBox"
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton"
import Table from "../../../shared/components/Table"
import OverlayLayer from "../../_components/OverlayLayer"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createRole, deleteRole, get, updateRole, type RolePayload } from "../api"
import columns from "../columns"
import Button from "../../_components/Button"
import { toast } from "../../_lib/toast";
import type { AxiosError } from "axios"
import type { RoleResponse } from "../interface"
import RoleForm from "./RoleForm"

function Roles() {
    const [page, setPage] = useState(1);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null);

    const { data: roles, refetch } = useQuery({
        queryKey: ['roles', page],
        queryFn: () => get({ params: { page, limit: 10 } }),
        select: (response) => response.data.data,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteRole,
        onSuccess: () => {
            toast.success("Role deleted successfully!");
            refetch();
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? "Failed to delete role");
        }
    });

    const createMutation = useMutation({
        mutationFn: (payload: RolePayload) => createRole(payload),
        onSuccess: () => {
            toast.success("Role created successfully!");
            setIsFormOpen(false);
            setSelectedRole(null);
            refetch();
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? "Failed to create role");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: RolePayload }) =>
            updateRole(id, payload),
        onSuccess: () => {
            toast.success("Role updated successfully!");
            setIsFormOpen(false);
            setSelectedRole(null);
            refetch();
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message ?? "Failed to update role");
        }
    });

    const handleFormSubmit = (values: RolePayload) => {
        if (selectedRole) {
            updateMutation.mutate({ id: selectedRole._id, payload: values });
        } else {
            createMutation.mutate(values);
        }
    };

    const roleColumns = useMemo(() => columns(), [roles]);

    return (
        <>
            <SectionTitleLineWithButton icon={mdiTableBorder} title="Roles" main>
                <Button
                       type="button"
                    label="Add Role"
                    color="info"
                    className="py-3 font-medium"
                    small
                    onClick={() => {
                        setSelectedRole(null);
                        setIsFormOpen(true);
                    }}
                />
            </SectionTitleLineWithButton>
            <CardBox className="mb-6" hasTable>
                {roles?.items && (
                    <Table
                        data={roles}
                        columns={roleColumns}
                        onPageChange={(pageIndex) => setPage(pageIndex + 1)}
                        deleteMutation={deleteMutation}
                        onEdit={(row) => {
                            setSelectedRole(row as RoleResponse);
                            setIsFormOpen(true);
                        }}
                         deleteModalTitle="Delete Role"
                        deleteModalMessage="Are you sure you want to delete this role?"
                    />
                )}
            </CardBox>
            {isFormOpen && (
                <OverlayLayer onClick={() => { setIsFormOpen(false); setSelectedRole(null); }}>
                    <div className="flex w-11/12 max-w-md max-h-[90vh] flex-col items-center overflow-y-auto py-8">
                        <div className="z-50 w-full shrink-0 animate-fade-in shadow-lg">
                            <RoleForm
                                initialValues={selectedRole}
                                onSubmit={handleFormSubmit}
                                onCancel={() => {
                                    setIsFormOpen(false);
                                    setSelectedRole(null);
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

export default Roles