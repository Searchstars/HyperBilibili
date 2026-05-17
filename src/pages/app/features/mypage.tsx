import { makeTodoPage } from "../../../features/_todo/TodoPage";

const Inner = makeTodoPage("我的 mypage");

export default function mypage() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[mypage] onInit (todo)"); },
};
