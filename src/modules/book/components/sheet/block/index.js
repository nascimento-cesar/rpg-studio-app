import Feature from "../feature/index";
import Heading from "../../heading";
import Paragraph from "../../paragraph";

export default class Block {
  constructor(props, parent, sibling = null) {
    this.$node = this.createNode(props);
    this.parent = parent;
    this.props = this.setInitialProps(props);
    this.sibling = sibling;
    this.state = this.setInitialState(sibling);
  }

  render() {
    this.appendToParent();

    const headingRenderingComplete = this.renderHeading();

    if (!headingRenderingComplete) {
      return false;
    }

    const paragraphsRenderingComplete = this.renderAllParagraphs();

    if (!paragraphsRenderingComplete) {
      return false;
    }

    const featuresRenderingComplete = this.renderAllFeatures();

    if (!featuresRenderingComplete) {
      return false;
    }

    return true;
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode(props) {
    const $node = document.createElement("DIV");
    $node.classList.add("block");
    $node.setAttribute("data-id", props.data.id);
    return $node;
  }

  detectHeightOverflow() {
    return this.parent.detectHeightOverflow();
  }

  getCurrentFeatureSibling(featureId) {
    const sheetHasSibling = !!this.sibling;

    if (!sheetHasSibling) {
      return false;
    }

    return this.sibling.state.features.find((feature) => {
      return feature.props.data.id === featureId;
    });
  }

  getCurrentParagraphSibling(paragraphId) {
    const sheetHasSibling = !!this.sibling;

    if (!sheetHasSibling) {
      return false;
    }

    return this.sibling.state.paragraphs.find((paragraph) => {
      return paragraph.props.data.id === paragraphId;
    });
  }

  headingPreviouslyRendered(sibling = this) {
    return sibling
      ? !!sibling.state.heading ||
          this.headingPreviouslyRendered(sibling.sibling)
      : false;
  }

  removeNode() {
    this.$node.remove();
    delete this.$node;
  }

  renderAllFeatures() {
    for (
      this.state.lastFeatureIndex;
      this.state.lastFeatureIndex < this.props.data.features.length;
      this.state.lastFeatureIndex++
    ) {
      const featureData = this.props.data.features[this.state.lastFeatureIndex];
      const renderingComplete = this.renderFeature(
        featureData,
        this.state.lastFeatureIndex
      );

      if (!renderingComplete) {
        return false;
      }
    }

    return true;
  }

  renderAllParagraphs() {
    for (
      this.state.lastParagraphIndex;
      this.state.lastParagraphIndex < this.props.data.paragraphs.length;
      this.state.lastParagraphIndex++
    ) {
      const paragraphData =
        this.props.data.paragraphs[this.state.lastParagraphIndex];
      const renderingComplete = this.renderParagraph(
        paragraphData,
        this.state.lastParagraphIndex
      );

      if (!renderingComplete) {
        return false;
      }
    }

    return true;
  }

  renderFeature(componentData, featureIndex) {
    const featureProps = { data: componentData };
    const featureSibling = this.getCurrentFeatureSibling(componentData.id);
    const feature = new Feature(featureProps, this, featureSibling);
    const renderingComplete = feature.render();

    if (feature.$node) {
      this.state.features.push(feature);
    }

    if (!renderingComplete) {
      const isTheFirstFeature = featureIndex === 0;
      const featureIsEmpty = !feature.$node;
      const hasNoParagraphs = this.state.paragraphs.length === 0;

      if (isTheFirstFeature && featureIsEmpty && hasNoParagraphs) {
        this.removeNode();
      }
    }

    return renderingComplete;
  }

  renderHeading() {
    if (this.headingPreviouslyRendered()) {
      return true;
    }

    const headingProps = { data: { text: this.props.data.heading, level: 3 } };
    const heading = new Heading(headingProps, this);
    const renderingComplete = heading.render();

    if (!renderingComplete) {
      this.removeNode();
      return false;
    }

    this.state.heading = heading;

    return true;
  }

  renderParagraph(componentData, paragraphIndex) {
    const paragraphProps = { data: componentData };
    const paragraphSibling = this.getCurrentParagraphSibling(componentData.id);
    const paragraph = new Paragraph(paragraphProps, this, paragraphSibling);
    const renderingComplete = paragraph.render();

    if (paragraph.$node) {
      this.state.paragraphs.push(paragraph);
    }

    if (!renderingComplete) {
      const isTheFirstParagraph = paragraphIndex === 0;
      const paragraphIsEmpty = !paragraph.$node;

      if (isTheFirstParagraph && paragraphIsEmpty) {
        this.removeNode();
      }
    }

    return renderingComplete;
  }

  setInitialProps(props) {
    return { data: null, ...props };
  }

  setInitialState(sibling) {
    const siblingState = (!!sibling && sibling.state) || {};

    return {
      features: [],
      heading: null,
      lastFeatureIndex: siblingState.lastFeatureIndex || 0,
      lastParagraphIndex: siblingState.lastParagraphIndex || 0,
      paragraphs: [],
      startingFeatureIndex: siblingState.lastFeatureIndex || 0,
      startingParagraphIndex: siblingState.lastParagraphIndex || 0,
    };
  }
}
