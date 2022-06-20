export default class Label {
  constructor(props, parent) {
    this.$node = this.createNode();
    this.parent = parent;
    this.props = this.setInitialProps(props);
  }

  render() {
    this.appendToParent();

    this.$node.textContent = this.props.text;

    if (this.parent.detectHeightOverflow()) {
      this.removeNode();
      return false;
    }

    return true;
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode() {
    const $node = document.createElement("SPAN");
    $node.classList.add("label");
    return $node;
  }

  removeNode() {
    this.$node.remove();
    delete this.$node;
  }

  setInitialProps(props) {
    return {
      text: null,
      ...props,
    };
  }
}
