import React from "react";

interface Props {
    filter: any;
    onFilterChange: any;
}

export function TodoListFilter({ filter, onFilterChange }: Props) {
    return (
        <div>
            Show completed
            <input
                type="checkbox"
                checked={filter.completed}
                onChange={onFilterChange}
            />
            ;
        </div>
    );
}
