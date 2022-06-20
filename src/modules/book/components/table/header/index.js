import Row from "../row";

export default class Header {
  constructor(props, parent) {
    this.$node = this.createNode(props);
    this.parent = parent;
    this.props = this.setInitialProps(props);
  }

  render() {
    this.appendToParent();
    return this.renderHeaderRow();
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode() {
    return document.createElement("THEAD");
  }

  detectHeightOverflow() {
    return this.parent.detectHeightOverflow();
  }

  removeNode() {
    this.$node.remove();
    delete this.$node;
  }

  renderHeaderRow() {
    const rowProps = { data: this.props.data };
    const row = new Row(rowProps, this);
    const renderingComplete = row.render();

    if (!renderingComplete) {
      this.removeNode();
    }

    return renderingComplete;
  }

  setInitialProps(props) {
    return { data: null, ...props };
  }
}
