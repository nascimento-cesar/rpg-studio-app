import Label from "./label";
import Paragraph from "../../paragraph";

export default class Feature {
  constructor(props, parent, sibling = null) {
    this.$node = this.createNode(props);
    this.parent = parent;
    this.props = this.setInitialProps(props);
    this.sibling = sibling;
    this.state = this.setInitialState(sibling);
  }

  render() {
    this.appendToParent();

    const labelRenderingComplete = this.renderLabel();

    if (!labelRenderingComplete) {
      return false;
    }

    const paragraphRenderingComplete = this.renderParagraph();

    if (!paragraphRenderingComplete) {
      return false;
    }

    return true;
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode(props) {
    const $node = document.createElement("DIV");
    $node.classList.add("feature");
    $node.setAttribute("data-id", props.data.id);
    return $node;
  }

  detectHeightOverflow() {
    return this.parent.detectHeightOverflow();
  }

  getParagraphSibling() {
    const featureHasSibling = !!this.sibling;

    if (!featureHasSibling) {
      return false;
    }

    return this.sibling.state.paragraph;
  }

  labelPreviouslyRendered(sibling = this) {
    return sibling
      ? !!sibling.state.label || this.labelPreviouslyRendered(sibling.sibling)
      : false;
  }

  removeNode() {
    this.$node.remove();
    delete this.$node;
  }

  renderParagraph() {
    const paragraphProps = { data: { text: this.props.data.description } };
    const paragraphSibling = this.getParagraphSibling();
    const paragraph = new Paragraph(paragraphProps, this, paragraphSibling);
    const renderingComplete = paragraph.render();

    if (paragraph.$node) {
      this.state.paragraph = paragraph;
    } else {
      this.removeNode();
    }

    return renderingComplete;
  }

  renderLabel() {
    if (this.labelPreviouslyRendered()) {
      return true;
    }

    const labelProps = { text: this.props.data.name };
    const label = new Label(labelProps, this);
    const renderingComplete = label.render();

    if (!renderingComplete) {
      this.removeNode();
      return false;
    }

    this.state.label = label;

    return true;
  }

  setInitialProps(props) {
    return { data: null, ...props };
  }

  setInitialState() {
    return {
      paragraph: null,
      label: null,
    };
  }
}
