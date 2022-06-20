import Content from "./content";
import Heading from "../heading";
import Image from "../image";
import Margin from "./margin";
import NoteBox from "../note-box";
import Paragraph from "../paragraph";
import Sheet from "../sheet";
import Table from "../table";

export default class Page {
  constructor(props, parent) {
    this.$node = this.createNode(props);
    this.parent = parent;
    this.props = this.setInitialProps(props);
    this.state = this.setInitialState();
  }

  render() {
    this.appendToParent();
    this.renderContent();
    this.renderMargins();
    this.renderPublicationName();
    this.renderPageNumber();
    this.renderUserLicense();
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode(props) {
    const $node = document.createElement("DIV");
    $node.classList.add("page");
    $node.setAttribute("data-page-index", props.pageIndex);
    return $node;
  }

  createMargin(position) {
    const marginProps = { position: position };
    return new Margin(marginProps, this);
  }

  parseComponentClass(type) {
    switch (type) {
      case "heading":
        return Heading;
      case "image":
        return Image;
      case "note_box":
        return NoteBox;
      case "paragraph":
        return Paragraph;
      case "sheet":
        return Sheet;
      case "table":
        return Table;
      default:
        break;
    }
  }

  renderComponent(componentData, componentSibling) {
    const currentColumn = this.state.content.requestCurrentColumn();
    const componentClass = this.parseComponentClass(componentData.type);
    const componentProps = { data: componentData };
    const component = new componentClass(
      componentProps,
      currentColumn,
      componentSibling
    );
    const componentRenderingComplete = component.render();
    const hasContent = !!component.$node;

    if (hasContent) {
      this.state.components.push(component);
    }

    if (!componentRenderingComplete) {
      const columnRenderingComplete = this.state.content.renderNewColumn();
      const componentSibling = hasContent && component;

      if (!columnRenderingComplete) {
        return [false, componentSibling];
      }

      return this.renderComponent(componentData, componentSibling);
    }

    return [true, component];
  }

  renderContent() {
    this.state.content = new Content(this, { maxColumnsCount: 2 });
    this.state.content.render();
  }

  renderUserLicense() {
    const $userLicense = document.createElement("DIV");
    $userLicense.classList.add("user-license");
    $userLicense.textContent = "Licensed to contact.rpgstudio@gmail.com";
    this.state.marginBottom.$node.appendChild($userLicense);
  }

  renderMargins() {
    this.state.marginBottom = this.createMargin("bottom");
    this.state.marginBottomLeft = this.createMargin("bottom-left");
    this.state.marginBottomRight = this.createMargin("bottom-right");
    this.state.marginLeft = this.createMargin("left");
    this.state.marginRight = this.createMargin("right");
    this.state.marginTop = this.createMargin("top");
    this.state.marginTopLeft = this.createMargin("top-left");
    this.state.marginTopRight = this.createMargin("top-right");

    this.state.marginTop.render();
    this.state.marginTopRight.render();
    this.state.marginRight.render();
    this.state.marginBottomRight.render();
    this.state.marginBottom.render();
    this.state.marginBottomLeft.render();
    this.state.marginLeft.render();
    this.state.marginTopLeft.render();
  }

  renderPageNumber() {
    const $pageNumber = document.createElement("DIV");
    $pageNumber.classList.add("page-number");
    $pageNumber.textContent = this.props.pageIndex + 1;
    this.state.marginTop.$node.appendChild($pageNumber);
  }

  renderPublicationName() {
    const $publicationName = document.createElement("DIV");
    $publicationName.classList.add("publication-name");
    $publicationName.textContent = this.props.publicationName;
    this.state.marginTop.$node.appendChild($publicationName);
  }

  setInitialProps(props) {
    return { pageIndex: 0, publicationName: null, ...props };
  }

  setInitialState() {
    return {
      components: [],
      content: null,
      marginBottom: null,
      marginLeft: null,
      marginRight: null,
      marginTop: null,
    };
  }
}
