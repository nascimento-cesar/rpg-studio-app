import Block from "./block";
import Feature from "./feature/index";
import Heading from "../heading";
import Image from "../image";
import Paragraph from "../paragraph";
import Tag from "./tag";

export default class Sheet {
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

    const tagsRenderingComplete = this.renderAllTags();

    if (!tagsRenderingComplete) {
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

    const blocksRenderingComplete = this.renderAllBlocks();

    if (!blocksRenderingComplete) {
      return false;
    }

    if (this.props.data.image) {
      const imageRenderingComplete = this.renderImage();

      if (!imageRenderingComplete) {
        return false;
      }
    }

    return true;
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode(props) {
    const $node = document.createElement("DIV");
    $node.classList.add("sheet");
    $node.setAttribute("data-id", props.data.id);
    return $node;
  }

  detectHeightOverflow() {
    return this.parent.detectHeightOverflow();
  }

  getCurrentBlockSibling(blockId) {
    const sheetHasSibling = !!this.sibling;

    if (!sheetHasSibling) {
      return false;
    }

    return this.sibling.state.blocks.find((block) => {
      return block.props.data.id === blockId;
    });
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

  renderAllBlocks() {
    for (
      this.state.lastBlockIndex;
      this.state.lastBlockIndex < this.props.data.blocks.length;
      this.state.lastBlockIndex++
    ) {
      const blockData = this.props.data.blocks[this.state.lastBlockIndex];
      const blockProps = { data: blockData };
      const blockSibling = this.getCurrentBlockSibling(blockData.id);
      const block = new Block(blockProps, this, blockSibling);
      const renderingComplete = block.render();

      if (block.$node) {
        this.state.blocks.push(block);
      }

      if (!renderingComplete) {
        const isTheFirstBlock = this.state.lastBlockIndex === 0;
        const blockIsEmpty = !block.$node;
        const hasNoParagraphs = this.state.paragraphs.length === 0;
        const hasNoFeatures = this.state.features.length === 0;

        if (
          isTheFirstBlock &&
          blockIsEmpty &&
          hasNoParagraphs &&
          hasNoFeatures
        ) {
          this.removeNode();
        }
      }

      if (!renderingComplete) {
        return false;
      }
    }

    return true;
  }

  renderAllFeatures() {
    for (
      this.state.lastFeatureIndex;
      this.state.lastFeatureIndex < this.props.data.features.length;
      this.state.lastFeatureIndex++
    ) {
      const featureData = this.props.data.features[this.state.lastFeatureIndex];
      const featureProps = { data: featureData };
      const featureSibling = this.getCurrentFeatureSibling(featureData.id);
      const feature = new Feature(featureProps, this, featureSibling);
      const renderingComplete = feature.render();

      if (feature.$node) {
        this.state.features.push(feature);
      }

      if (!renderingComplete) {
        const isTheFirstFeature = this.state.lastFeatureIndex === 0;
        const featureIsEmpty = !feature.$node;
        const hasNoParagraphs = this.state.paragraphs.length === 0;

        if (isTheFirstFeature && featureIsEmpty && hasNoParagraphs) {
          this.removeNode();
        }
      }

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
      const paragraphProps = { data: paragraphData };
      const paragraphSibling = this.getCurrentParagraphSibling(
        paragraphData.id
      );
      const paragraph = new Paragraph(paragraphProps, this, paragraphSibling);
      const renderingComplete = paragraph.render();

      if (paragraph.$node) {
        this.state.paragraphs.push(paragraph);
      }

      if (!renderingComplete) {
        const isTheFirstParagraph = this.state.lastParagraphIndex === 0;
        const paragraphIsEmpty = !paragraph.$node;

        if (isTheFirstParagraph && paragraphIsEmpty) {
          this.removeNode();
        }
      }

      if (!renderingComplete) {
        return false;
      }
    }

    return true;
  }

  renderAllTags() {
    if (this.tagsPreviouslyRendered()) {
      return true;
    }

    const tagsData = this.props.data.tags;

    for (const tagData of tagsData) {
      const tagProps = { data: tagData };
      const tag = new Tag(tagProps, this);
      const renderingComplete = tag.render();

      if (!renderingComplete) {
        this.state.tags = [];
        this.removeNode();
        return false;
      }

      this.state.tags.push(tag);
    }

    return true;
  }

  renderHeading() {
    if (this.headingPreviouslyRendered()) {
      return true;
    }

    const headingProps = { data: { text: this.props.data.heading, level: 1 } };
    const heading = new Heading(headingProps, this);
    const renderingComplete = heading.render();

    if (!renderingComplete) {
      this.removeNode();
      return false;
    }

    this.state.heading = heading;

    return true;
  }

  renderImage() {
    const image = new Image({ data: this.props.data.image }, this);
    const renderingComplete = image.render();

    if (!renderingComplete) {
      return false;
    }

    this.state.image = image;

    return true;
  }

  setInitialProps(props) {
    return { data: null, ...props };
  }

  setInitialState(sibling) {
    const siblingState = (!!sibling && sibling.state) || {};

    return {
      blocks: [],
      features: [],
      heading: null,
      image: null,
      lastBlockIndex: siblingState.lastBlockIndex || 0,
      lastFeatureIndex: siblingState.lastFeatureIndex || 0,
      lastParagraphIndex: siblingState.lastParagraphIndex || 0,
      paragraphs: [],
      startingBlockIndex: siblingState.lastBlockIndex || 0,
      startingFeatureIndex: siblingState.lastFeatureIndex || 0,
      startingParagraphIndex: siblingState.lastParagraphIndex || 0,
      tags: [],
    };
  }

  tagsPreviouslyRendered(sibling = this) {
    return sibling
      ? sibling.state.tags.length > 0 ||
          this.tagsPreviouslyRendered(sibling.sibling)
      : false;
  }
}
