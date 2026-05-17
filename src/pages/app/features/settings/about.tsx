import { makeTodoPage } from "../../../../features/_todo/TodoPage";

const Inner = makeTodoPage("关于 about");

export default function about() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[about] onInit (todo)"); },
};
