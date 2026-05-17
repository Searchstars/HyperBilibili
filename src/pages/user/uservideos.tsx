import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("用户视频 uservideos");

export default function uservideos() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[uservideos] onInit (todo)"); },
};
