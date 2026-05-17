import PrePage from "../../../features/entry/PrePage";

export default function prepage() {
  return <PrePage />;
}

export const lifecycle = {
  onInit() {
    console.log("[prepage] onInit");
  },
};
