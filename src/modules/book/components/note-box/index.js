import Heading from "../heading";
import Paragraph from "../paragraph";

export default class NoteBox {
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

    return true;
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode(props) {
    const $node = document.createElement("DIV");
    $node.classList.add("note-box");
    $node.setAttribute("data-id", props.data.id);
    return $node;
  }

  detectHeightOverflow() {
    return this.parent.detectHeightOverflow();
  }

  getCurrentParagraphSibling(paragraphId) {
    const noteBoxHasSibling = !!this.sibling;

    if (!noteBoxHasSibling) {
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
        this.state.lastParagraphIndex,
        this.getCurrentParagraphSibling(paragraphData.id)
      );

      if (!renderingComplete) {
        return false;
      }
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

  renderParagraph(componentData, paragraphIndex, sibling = null) {
    const paragraphProps = { data: componentData };
    const paragraph = new Paragraph(paragraphProps, this, sibling);
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
      heading: null,
      lastParagraphIndex: siblingState.lastParagraphIndex || 0,
      paragraphs: [],
      startingParagraphIndex: siblingState.lastParagraphIndex || 0,
    };
  }
}
