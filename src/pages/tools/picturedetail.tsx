import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("图片详情 picturedetail");

export default function picturedetail() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[picturedetail] onInit (todo)"); },
};
