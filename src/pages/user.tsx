import { makeTodoPage } from "../features/_todo/TodoPage";

const Inner = makeTodoPage("用户主页 user");

export default function user() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[user] onInit (todo)"); },
};
