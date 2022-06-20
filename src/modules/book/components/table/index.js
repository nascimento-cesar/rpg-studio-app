import Body from "./body";
import Header from "./header";

export default class Table {
  constructor(props, parent, sibling = null) {
    this.$node = this.createNode(props);
    this.parent = parent;
    this.props = this.setInitialProps(props);
    this.sibling = sibling;
    this.state = this.setInitialState(sibling);
  }

  render() {
    this.appendToParent();

    const headerRenderingComplete = this.renderHeader();

    if (!headerRenderingComplete) {
      return false;
    }

    const bodyRenderingComplete = this.renderBody();

    if (!bodyRenderingComplete) {
      return false;
    }

    return true;
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode(props) {
    const $node = document.createElement("TABLE");
    $node.classList.add("table");
    $node.setAttribute("data-id", props.data.id);
    return $node;
  }

  detectHeightOverflow() {
    return this.parent.detectHeightOverflow();
  }

  headerPreviouslyRendered(sibling = this) {
    return sibling
      ? !!sibling.state.header || this.headerPreviouslyRendered(sibling.sibling)
      : false;
  }

  removeNode() {
    this.$node.remove();
    delete this.$node;
  }

  renderBody() {
    const bodyProps = { data: this.props.data };
    const bodySibling = this.sibling ? this.sibling.state.body : null;
    const body = new Body(bodyProps, this, bodySibling);
    const renderingComplete = body.render();

    if (body.$node) {
      this.state.body = body;
    } else {
      this.removeNode();
    }

    return renderingComplete;
  }

  renderHeader() {
    if (this.headerPreviouslyRendered()) {
      return true;
    }

    const headerProps = { data: this.props.data.header };
    const header = new Header(headerProps, this);
    const renderingComplete = header.render();

    if (!renderingComplete) {
      this.removeNode();
      return false;
    }

    this.state.header = header;

    return true;
  }

  setInitialProps(props) {
    return { data: null, ...props };
  }

  setInitialState(sibling) {
    const siblingState = (!!sibling && sibling.state) || {};

    return {
      body: null,
      header: null,
      lastRowIndex: siblingState.lastRowIndex || 0,
      startingRowIndex: siblingState.lastRowIndex || 0,
    };
  }
}
