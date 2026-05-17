import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("历史记录 history");

export default function history() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[history] onInit (todo)"); },
};
