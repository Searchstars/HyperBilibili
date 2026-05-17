import { makeTodoPage } from "../../../features/_todo/TodoPage";

const Inner = makeTodoPage("设置 settings");

export default function settings() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[settings] onInit (todo)"); },
};
