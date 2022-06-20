import Page from "../page";

export default class Publication {
  constructor(props) {
    this.$node = this.createNode(props);
    this.props = this.setInitialProps(props);
    this.state = this.setInitialState();
  }

  render() {
    this.appendToParent();

    for (const sectionData of this.props.data.sections || []) {
      this.renderSection(sectionData);
    }

    console.log(this);

    return true;
  }

  appendToParent() {
    this.props.$parentNode.appendChild(this.$node);
  }

  createNode(props) {
    const $node = document.createElement("DIV");
    $node.classList.add("publication");
    $node.setAttribute("data-id", props.data.id);
    return $node;
  }

  renderNewPage() {
    const pageProps = {
      pageIndex: this.state.pages.length,
      publicationName: this.props.data.name,
    };
    const page = new Page(pageProps, this);
    page.render();
    this.state.pages.push(page);
    return page;
  }

  getCurrentPage() {
    return (
      this.state.pages[this.state.pages.length - 1] || this.renderNewPage()
    );
  }

  renderComponent(componentData, componentSibling = null) {
    const currentPage = this.getCurrentPage();

    const [renderingComplete, component] = currentPage.renderComponent(
      componentData,
      componentSibling
    );

    if (!renderingComplete) {
      this.renderNewPage();
      return this.renderComponent(componentData, component);
    }

    return true;
  }

  renderHeading(sectionData) {
    const headingData = {
      level: sectionData.level,
      text: sectionData.heading,
      type: "heading",
    };
    return this.renderComponent(headingData);
  }

  renderSection(sectionData) {
    this.renderHeading(sectionData);

    for (const componentData of sectionData.components) {
      this.renderComponent(componentData);
    }
  }

  setInitialProps(props) {
    return {
      $parentNode: null,
      data: null,
      ...props,
    };
  }

  setInitialState() {
    return { pages: [] };
  }
}
