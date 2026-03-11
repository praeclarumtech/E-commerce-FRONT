import type { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';

import type { RoleResponse } from "./interface";

const columns = (): ColumnDef<RoleResponse>[] => {
    return [
        {
            header: 'Sr No.',
            cell: (info) => info.row.index + 1,
        },
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Status',
            accessorKey: 'isActive',
            cell: (info) => (
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
            cell: (info) => moment(info.row.original.createdAt).format('DD/MM/YYYY'),
        },
        {
            header: 'Updated At',
            accessorKey: 'updatedAt',
            cell: (info) => moment(info.row.original.updatedAt).format('DD/MM/YYYY'),
        }
    ];
};

export default columns;
