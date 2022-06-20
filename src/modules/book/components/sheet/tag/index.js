export default class Tag {
  constructor(props, parent) {
    this.$node = this.createNode(props);
    this.parent = parent;
    this.props = this.setInitialProps(props);
  }

  render() {
    this.appendToParent();

    this.$node.textContent = this.props.data.text;

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
    const $node = document.createElement("DIV");
    $node.classList.add("tag");
    $node.setAttribute("data-id", props.data.id);
    return $node;
  }

  removeNode() {
    this.$node.remove();
    delete this.$node;
  }

  setInitialProps(props) {
    return { data: null, ...props };
  }
}
