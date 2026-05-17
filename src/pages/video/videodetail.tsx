import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("视频详情 videodetail");

export default function videodetail() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[videodetail] onInit (todo)"); },
};
