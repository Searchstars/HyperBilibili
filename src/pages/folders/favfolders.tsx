import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("收藏夹 favfolders");

export default function favfolders() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[favfolders] onInit (todo)"); },
};
