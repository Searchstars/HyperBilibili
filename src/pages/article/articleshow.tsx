import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("专栏阅读 articleshow");

export default function articleshow() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[articleshow] onInit (todo)"); },
};
