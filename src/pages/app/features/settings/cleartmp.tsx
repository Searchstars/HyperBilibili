import { makeTodoPage } from "../../../../features/_todo/TodoPage";

const Inner = makeTodoPage("清缓存 cleartmp");

export default function cleartmp() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[cleartmp] onInit (todo)"); },
};
