import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("用户动态 userdynamic");

export default function userdynamic() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[userdynamic] onInit (todo)"); },
};
