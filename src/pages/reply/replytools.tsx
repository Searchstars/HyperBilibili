import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("评论工具 replytools");

export default function replytools() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[replytools] onInit (todo)"); },
};
