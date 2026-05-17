import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("权限错误 permissionerror");

export default function permissionerror() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[permissionerror] onInit (todo)"); },
};
