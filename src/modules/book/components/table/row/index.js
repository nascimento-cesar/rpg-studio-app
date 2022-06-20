import Column from "../column";

export default class Row {
  constructor(props, parent) {
    this.$node = this.createNode(props);
    this.parent = parent;
    this.props = this.setInitialProps(props);
    this.state = this.setInitialState();
  }

  render() {
    this.appendToParent();
    return this.renderColumns();
  }

  appendToParent() {
    this.parent.$node.append(this.$node);
  }

  detectHeightOverflow() {
    return this.parent.detectHeightOverflow();
  }

  createNode(props) {
    const $node = document.createElement("TR");
    $node.setAttribute("data-id", props.data.id);
    return $node;
  }

  removeNode() {
    this.$node.remove();
    delete this.$node;
  }

  renderColumns() {
    const columnsData = this.props.data.columns;

    for (const columnData of columnsData) {
      const columnProps = { data: columnData };
      const column = new Column(columnProps, this);
      const renderingComplete = column.render();

      if (!renderingComplete) {
        this.removeNode();
        return false;
      }

      this.state.columns.push(column);
    }

    return true;
  }

  setInitialProps(props) {
    return { data: null, ...props };
  }

  setInitialState() {
    return { columns: [] };
  }
}
