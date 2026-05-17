import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("文本详情 textdetail");

export default function textdetail() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[textdetail] onInit (todo)"); },
};
