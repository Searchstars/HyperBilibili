import { makeTodoPage } from "../../../features/_todo/TodoPage";

const Inner = makeTodoPage("首页 main");

export default function main() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[main] onInit (todo)"); },
};
