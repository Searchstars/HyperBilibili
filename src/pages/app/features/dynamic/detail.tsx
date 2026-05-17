import { makeTodoPage } from "../../../../features/_todo/TodoPage";

const Inner = makeTodoPage("动态详情 dynamic/detail");

export default function detail() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[detail] onInit (todo)"); },
};
