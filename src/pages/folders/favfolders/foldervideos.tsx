import { makeTodoPage } from "../../../features/_todo/TodoPage";

const Inner = makeTodoPage("收藏夹视频 foldervideos");

export default function foldervideos() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[foldervideos] onInit (todo)"); },
};
