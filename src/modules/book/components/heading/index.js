export default class Heading {
  constructor(props, parent) {
    this.$node = this.createNode(props);
    this.parent = parent;
    this.props = this.setInitialProps(props);
  }

  render() {
    this.appendToParent();

    this.$node.appendChild(document.createTextNode(this.props.data.text));

    if (this.parent.detectHeightOverflow()) {
      this.removeNode();
      return false;
    }

    return true;
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode(props) {
    const $node = document.createElement(`H${props.data.level}`);
    $node.classList.add("heading");
    return $node;
  }

  removeNode() {
    this.$node.remove();
    delete this.$node;
  }

  setInitialProps(props) {
    return {
      data: { level: 1, text: null },
      ...props,
    };
  }
}
