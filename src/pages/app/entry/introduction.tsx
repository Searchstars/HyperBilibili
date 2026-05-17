import IntroductionPage from "../../../features/entry/IntroductionPage";

export default function introduction() {
  return <IntroductionPage />;
}

export const lifecycle = {
  onInit() {
    console.log("[introduction] onInit");
  },
};
