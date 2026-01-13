import { useQuery } from '@tanstack/react-query';

import { getUsers } from '../api';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import moment from 'moment';

function useUsers() {

    const { data: users, isLoading, isFetching, isRefetching, error } = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers({ params: { page: 1, limit: 10 } }),
        select: (response) => response.data.data.items,
    });

    const columns: ColumnDef<any>[] = useMemo(() => {
        const _columns = [
            {
                header: 'Sr No.',
                cell: (info: any) => info.row.index + 1,
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (info: any) => (
                    <a href={`mailto:${info.row.original.email}`
                    } className="text-[#465fff] hover:underline" >
                        {info.row.original.email}
                    </a>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'isActive',
                cell: (info: any) => (
                    <span className={`px-2 py-1 rounded-full text-xs ${info.row.original.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`
                    }>
                        {info.row.original.isActive ? 'Active' : 'Inactive'}
                    </span>
                ),
            },
            {
                header: 'Created At',
                accessorKey: 'createdAt',
                cell: (info: any) => moment(info.row.original.createdAt).format('DD/MM/YYYY'),
            },
            {
                header: 'Updated At',
                accessorKey: 'updatedAt',
                cell: (info: any) => moment(info.row.original.updatedAt).format('DD/MM/YYYY'),
            },
        ]

        return _columns;
    }, []);


    return (
        {
            data: users || [],
            isLoading: isLoading || isFetching || isRefetching,
            error,
            columns,
        }
    )
}

export default useUsers