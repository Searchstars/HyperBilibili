import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("屏幕宽度错误 screenwidtherror");

export default function screenwidtherror() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[screenwidtherror] onInit (todo)"); },
};
