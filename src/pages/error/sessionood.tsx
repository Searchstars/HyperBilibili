import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("登录过期 sessionood");

export default function sessionood() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[sessionood] onInit (todo)"); },
};
