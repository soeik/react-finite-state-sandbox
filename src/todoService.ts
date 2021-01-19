import { TodoItem } from "./types";

const baseUrl = "https://jsonplaceholder.typicode.com";
export const todoService = {
    fetchTodos: (filter: any) =>
        fetch(baseUrl + "/todos?" + toQueryString(filter)).then((resp) =>
            resp.json()
        ),
    updateTodo: (id: number, todo: TodoItem) =>
        fetch(baseUrl + "/todos/" + id, {
            method: "PUT",
            body: JSON.stringify(todo)
        }).then((resp) => resp.json())
};

function toQueryString(params: any) {
    return Object.keys(params)
        .map((key) => key + "=" + params[key])
        .join("&");
}
