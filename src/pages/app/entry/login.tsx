import LoginPage from "../../../features/entry/LoginPage";

export default function login() {
  return <LoginPage />;
}

export const lifecycle = {
  onInit() {
    console.log("[login] onInit");
  },
};
