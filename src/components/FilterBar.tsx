import { useMedStore } from "../store/medStore";
import React from "react";

type StatusFilter = "all" | "ok" | "warning" | "expired";
type SortKey = "expDate" | "name" | "quantity";

export default function FilterBar() {
    const filter   = useMedStore((s) => s.filter);
    const sortBy   = useMedStore((s) => s.sortBy);
    const setFilter = useMedStore((s) => s.setFilter);
    const setSortBy = useMedStore((s) => s.setSortBy);

    const onStatusChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setFilter({ status: e.currentTarget.value as StatusFilter });
    };
    const onSortChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setSortBy(e.currentTarget.value as SortKey);
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <input
                value={filter.query}
                onChange={(e) => setFilter({ query: e.target.value })}
                placeholder="Szukaj nazwy…"
                className="px-3 py-2 rounded-xl ring-1 ring-zinc-300 w-56"
            />
            <select value={filter.status} onChange={onStatusChange} className="px-3 py-2 rounded-xl ring-1 ring-zinc-300">
                <option value="all">Status: wszystkie</option>
                <option value="ok">OK</option>
                <option value="warning">≤30 dni</option>
                <option value="expired">Po terminie</option>
            </select>

            <select
                value={filter.category}
                onChange={(e) => setFilter({ category: e.target.value })}
                className="px-3 py-2 rounded-xl ring-1 ring-zinc-300"
            >
                <option value="all">Kategoria: wszystkie</option>
                <option value="przeciwbólowe">Przeciwbólowe</option>
                <option value="przeciwzapalne">Przeciwzapalne</option>
                <option value="witaminy">Witaminy</option>
            </select>

            <select value={sortBy} onChange={onSortChange} className="px-3 py-2 rounded-xl ring-1 ring-zinc-300">
                <option value="expDate">Sortuj: data ważności</option>
                <option value="name">nazwa</option>
                <option value="quantity">ilość</option>
            </select>
        </div>
    );
}
