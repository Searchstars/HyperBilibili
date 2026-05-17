import { makeTodoPage } from "../../../features/_todo/TodoPage";

const Inner = makeTodoPage("缓存 savedcontent");

export default function savedcontent() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[savedcontent] onInit (todo)"); },
};
