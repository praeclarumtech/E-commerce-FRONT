import { useMemo, useState } from "react"
import { mdiTableBorder } from "@mdi/js"
import CardBox from "../../_components/CardBox"
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton"
import Table from "../../../shared/components/Table"
import { useMutation, useQuery } from "@tanstack/react-query"
import { deleteRole, get } from "../api"
import columns from "../columns"
import Button from "../../_components/Button"
import { toast } from "../../_lib/toast";
import type { AxiosError } from "axios"

function Roles() {
    const [page, setPage] = useState(1);

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
            toast.error(error.response?.data?.message ?? "Sign in failed");
        }
    });

    const roleColumns = useMemo(() => columns(), [roles]);

    return (
        <>
            <SectionTitleLineWithButton icon={mdiTableBorder} title="Roles" main>
                <Button
                    type="submit"
                    label="Add Role"
                    color="info"
                    className="py-3 font-medium"
                    small
                />
            </SectionTitleLineWithButton>
            <CardBox className="mb-6" hasTable>
                {roles?.items && (
                    <Table
                        data={roles}
                        columns={roleColumns}
                        onPageChange={(pageIndex) => setPage(pageIndex + 1)}
                        deleteMutation={deleteMutation}
                    />
                )}
            </CardBox>
        </>
    )
}

export default Roles