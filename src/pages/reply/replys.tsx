import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("评论列表 replys");

export default function replys() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[replys] onInit (todo)"); },
};
