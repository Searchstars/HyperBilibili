import { makeTodoPage } from "../../../features/_todo/TodoPage";

const Inner = makeTodoPage("动态 dynamic");

export default function dynamic() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[dynamic] onInit (todo)"); },
};
