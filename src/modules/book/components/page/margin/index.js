export default class Margin {
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
    $node.classList.add("margin");
    $node.classList.add(props.position);
    return $node;
  }

  setInitialProps(props) {
    return { position: null, ...props };
  }
}
