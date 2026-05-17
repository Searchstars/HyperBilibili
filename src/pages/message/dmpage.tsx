import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("私信会话 dmpage");

export default function dmpage() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[dmpage] onInit (todo)"); },
};
