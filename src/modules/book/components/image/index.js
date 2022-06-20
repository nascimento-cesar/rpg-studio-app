export default class Image {
  constructor(props, parent) {
    this.$node = this.createNode(props);
    this.parent = parent;
    this.props = this.setInitialProps(props);
  }

  render() {
    this.appendToParent();

    const imageRenderingComplete = this.renderImage();

    if (!imageRenderingComplete) {
      return false;
    }

    if (this.props.data.caption) {
      const captionRenderingComplete = this.renderCaption();

      if (!captionRenderingComplete) {
        return false;
      }
    }

    return true;
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode(props) {
    const $node = document.createElement("FIGURE");
    $node.classList.add("image");
    $node.setAttribute("data-id", props.data.id);
    return $node;
  }

  removeNode() {
    this.$node.remove();
    delete this.$node;
  }

  renderCaption() {
    const $caption = document.createElement("FIGCAPTION");
    $caption.textContent = this.props.data.caption;
    this.$node.appendChild($caption);

    if (this.parent.detectHeightOverflow()) {
      this.removeNode();
      return false;
    }

    return true;
  }

  renderImage() {
    const $image = document.createElement("IMG");
    $image.setAttribute("src", this.props.data.url);
    $image.setAttribute("alt", this.props.data.id);
    this.$node.appendChild($image);

    if (this.parent.detectHeightOverflow()) {
      this.removeNode();
      return false;
    }

    return true;
  }

  setInitialProps(props) {
    return { data: null, ...props };
  }
}
