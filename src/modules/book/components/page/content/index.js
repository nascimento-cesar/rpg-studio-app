import Column from "./column";

export default class Content {
  constructor(parent, props) {
    this.$node = this.createNode(props);
    this.parent = parent;
    this.props = this.setInitialProps(props);
    this.state = this.setInitialState();
  }

  render() {
    this.appendToParent();
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode(props) {
    const $node = document.createElement("DIV");
    $node.classList.add("content");
    $node.setAttribute("data-columns", props.maxColumnsCount);
    return $node;
  }

  renderNewColumn() {
    const columnIndex = this.state.columns.length;

    if (columnIndex >= this.props.maxColumnsCount) {
      return null;
    }

    const columnProps = {
      columnIndex: columnIndex,
      maxHeight: parseFloat(getComputedStyle(this.$node).maxHeight),
    };

    const column = new Column(columnProps, this);

    column.render();

    this.state.columns.push(column);

    return column;
  }

  requestCurrentColumn() {
    return (
      this.state.columns[this.state.columns.length - 1] ||
      this.renderNewColumn()
    );
  }

  setInitialProps(props) {
    return { maxColumnsCount: 1, ...props };
  }

  setInitialState() {
    return { columns: [] };
  }
}
