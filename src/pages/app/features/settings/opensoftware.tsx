import { makeTodoPage } from "../../../../features/_todo/TodoPage";

const Inner = makeTodoPage("开源声明 opensoftware");

export default function opensoftware() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[opensoftware] onInit (todo)"); },
};
