import sample from "./seeds/sample-1";
import Publication from "./components/publication";
import WebFont from "webfontloader";
import "./styles/index.scss";

export const render = () => {
  preloadFonts();

  const publicationProps = {
    $parentNode: document.querySelector("#preview"),
    data: sample,
  };
  const publication = new Publication(publicationProps);

  console.time("renderSample");
  const renderingComplete = publication.render();
  console.timeEnd("renderSample");

  return renderingComplete;
};

const preloadFonts = () => {
  WebFont.load({
    google: {
      families: ["Lora", "Cinzel:regular,bold,black"],
    },
  });
};
