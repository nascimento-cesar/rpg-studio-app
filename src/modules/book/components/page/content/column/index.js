export default class Column {
  constructor(props, parent) {
    this.$node = this.createNode(props);
    this.parent = parent;
    this.props = this.setInitialProps(props);
  }

  render() {
    this.appendToParent();
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode(props) {
    const $node = document.createElement("DIV");
    $node.classList.add("column");
    $node.setAttribute("data-column-index", props.columnIndex);
    return $node;
  }

  detectHeightOverflow() {
    return this.$node.clientHeight > this.props.maxHeight;
  }

  setInitialProps(props) {
    return { columnIndex: 0, width: 0, maxHeight: 0, ...props };
  }
}
