import React from "react";
import { todoService } from "./todoService";
import { TodoItem } from "./types";
import { TodoListFilter } from "./TodoListFilter";
import { TodoList } from "./TodoList";
import {useFiniteState, UseFiniteStateOptions} from "./useFiniteState";


enum TodoAppState {
  Loading = "Loading",
  Normal = "Normal",
  Updating = "Updating",
  Error = "Error"
}

interface TodoAppContext {
  todos: TodoItem[];
  currentTodo?: TodoItem;
  filter: { completed: boolean };
}

const useFiniteStateOptions: UseFiniteStateOptions<
    TodoAppState,
    TodoAppContext
    > = {
  initialState: TodoAppState.Loading,
  initialContext: {
    todos: [],
    filter: { completed: false }
  },
  effects: {
    [TodoAppState.Loading]: ({ setState, context }) =>
        todoService.fetchTodos(context.filter).then((todos) =>
            setState(TodoAppState.Normal, {
              ...context,
              todos
            })
        ),
    [TodoAppState.Updating]: ({ setState, context }) =>
        context.currentTodo &&
        todoService
            .updateTodo(context.currentTodo.id, context.currentTodo)
            .then(() => {
              setState(TodoAppState.Normal);
            })
  }
};

export default function App() {
  const { state, setState, context } = useFiniteState<
      TodoAppState,
      TodoAppContext
      >(useFiniteStateOptions);

  const onFilterChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      setState(TodoAppState.Loading, (ctx) => ({
        ...ctx,
        filter: {
          completed: e.target.checked
        }
      }));

  const onSetCompleted = (updatedTodo: TodoItem) => {
    setState(TodoAppState.Updating, (ctx) => ({
      ...ctx,
      currentTodo: updatedTodo,
      todos: ctx.todos.map((t) => ({
        ...t,
        completed: t.id === updatedTodo.id ? updatedTodo.completed : t.completed
      }))
    }));
  };

  return (
      <div>
        <TodoListFilter filter={context.filter} onFilterChange={onFilterChange} />
        {renderUiStates()}
      </div>
  );

  function renderUiStates() {
    switch (state) {
      case TodoAppState.Loading:
        return <div>Loading...</div>;
      case TodoAppState.Error:
        return <div>Error</div>;
      default:
        return (
            <TodoList
                todos={context.todos}
                onSetCompleted={onSetCompleted}
                disabled={state === TodoAppState.Updating}
            />
        );
    }
  }
}
