import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("搜索 search");

export default function search() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[search] onInit (todo)"); },
};
