import { makeTodoPage } from "../../../../features/_todo/TodoPage";

const Inner = makeTodoPage("捐赠 donation");

export default function donation() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[donation] onInit (todo)"); },
};
