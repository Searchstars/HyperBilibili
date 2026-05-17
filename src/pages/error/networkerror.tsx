import NetworkErrorPage from "../../features/error/NetworkErrorPage";

export default function networkerror() {
  return <NetworkErrorPage />;
}

export const lifecycle = {
  onInit() {
    console.log("[networkerror] onInit");
  },
};
