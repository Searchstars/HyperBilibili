import { makeTodoPage } from "../../features/_todo/TodoPage";

const Inner = makeTodoPage("消息中心 messages");

export default function messages() {
  return <Inner />;
}

export const lifecycle = {
  onInit() { console.log("[messages] onInit (todo)"); },
};
