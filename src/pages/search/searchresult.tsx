import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("搜索结果 searchresult");

export default function searchresult() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[searchresult] onInit (todo)"); },
};
