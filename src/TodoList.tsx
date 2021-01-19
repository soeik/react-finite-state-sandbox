import React from "react";
import { TodoItem } from "./types";

interface Props {
    todos: TodoItem[];
    onSetCompleted: (t: TodoItem) => void;
    disabled: boolean;
}

export function TodoList({ todos, onSetCompleted, disabled }: Props) {
    const onCheckboxChange = (todo: TodoItem) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        onSetCompleted({
            ...todo,
            completed: e.target.checked
        });
    };

    return (
        <div>
            {todos.map((t: TodoItem) => (
                <div key={t.id}>
                    <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={onCheckboxChange(t)}
                        disabled={disabled}
                    />
                    {t.title}
                </div>
            ))}
        </div>
    );
}
