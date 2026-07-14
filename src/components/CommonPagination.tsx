import React, { useEffect, useState } from 'react'
import { getPaginationData } from '../helpers/fun_helpers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type CommonPaginationProps = {
  totalCount: number;
  filters: {
    limit: string;
    page: number;
    sellerId?: number;
    storeId?: number;
    orderBy?: string;
    search?: string;
    dateRangeValue?: number;
    dateRange?: Date[];
  };
  changePage: (filters: any) => void;
};

function CommonPagination({ totalCount = 0, filters, changePage }: CommonPaginationProps) {
    const [pagination, setPagination] = useState([]);

    const limitList = [
        {
            label: "10",
            value: "10"
        },
        {
            label: "25",
            value: "25"
        },
        {
            label: "50",
            value: "50"
        },
        {
            label: "100",
            value: "100"
        },
        {
            label: "250",
            value: "250"
        },
    ] // same as before

    useEffect(() => {
        const pageArray = getPaginationData(filters?.page, totalCount, filters?.limit)
        setPagination([...pageArray]);
    }, [filters, totalCount]);

    return (
        <div className='flex justify-between items-center common-pagination-style'>
            <div className="flex items-center justify-between py-2">
                <ul className="flex space-x-1">
                    {pagination.map((row, index) => (
                        <li key={index}>
                            <button
                                disabled={row.disabled}
                                onClick={() =>
                                    changePage({ ...filters, page: Number(row.value) })
                                }
                                className={`px-3 py-1 rounded-md text-sm transition-colors 
                                    ${row.disabled
                                        ? `bg-primary text-white text-secondary-foreground cursor-not-allowed`
                                        : row.active
                                            ? 'bg-accent text-primary font-semibold'
                                            : 'bg-accent text-primary '
                                    }`}
                            >
                                {row.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <Select
                    value={`${filters?.limit}`}
                    onValueChange={(e) => changePage({ ...filters, page: 1, limit: e })}
                >
                    <SelectTrigger className='py-1 h-7'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="py-0">
                        {limitList.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}


export default CommonPagination