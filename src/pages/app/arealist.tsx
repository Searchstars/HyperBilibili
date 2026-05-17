import ArealistPage from "../../features/entry/ArealistPage";

export default function arealist() {
  return <ArealistPage />;
}

export const lifecycle = {
  onInit() {
    console.log("[arealist] onInit");
  },
};
