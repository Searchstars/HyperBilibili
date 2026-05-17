import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("专栏保存 articlesave");

export default function articlesave() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[articlesave] onInit (todo)"); },
};
