import EulaReadPage from "../../../features/entry/EulaReadPage";

export default function eularead() {
  return <EulaReadPage />;
}

export const lifecycle = {
  onInit() {
    console.log("[eularead] onInit");
  },
};
