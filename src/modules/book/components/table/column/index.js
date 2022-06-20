export default class Column {
  constructor(props, parent) {
    this.$node = this.createNode(props);
    this.parent = parent;
    this.props = this.setInitialProps(props);
  }

  render() {
    this.appendToParent();

    this.$node.textContent = this.props.data;

    if (this.parent.detectHeightOverflow()) {
      this.removeNode();
      return false;
    }

    return true;
  }

  appendToParent() {
    this.parent.$node.append(this.$node);
  }

  createNode(props) {
    return document.createElement(props.isHeaderColumn ? "TH" : "TD");
  }

  removeNode() {
    this.$node.remove();
    delete this.$node;
  }

  setInitialProps(props) {
    return { data: null, isHeaderColumn: false, ...props };
  }
}
