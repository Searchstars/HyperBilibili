import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("私信列表 dmlist");

export default function dmlist() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[dmlist] onInit (todo)"); },
};
