import Row from "../row";

export default class Body {
  constructor(props, parent, sibling = null) {
    this.$node = this.createNode();
    this.parent = parent;
    this.props = this.setInitialProps(props);
    this.sibling = sibling;
    this.state = this.setInitialState(sibling);
  }

  render() {
    this.appendToParent();
    return this.renderAllRows();
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode() {
    return document.createElement("TBODY");
  }

  detectHeightOverflow() {
    return this.parent.detectHeightOverflow();
  }

  removeNode() {
    this.$node.remove();
    delete this.$node;
  }

  renderAllRows() {
    for (
      this.state.lastRowIndex;
      this.state.lastRowIndex < this.props.data.rows.length;
      this.state.lastRowIndex++
    ) {
      const rowData = this.props.data.rows[this.state.lastRowIndex];
      const renderingComplete = this.renderRow(
        rowData,
        this.state.lastRowIndex
      );

      if (!renderingComplete) {
        return false;
      }
    }

    return true;
  }

  renderRow(componentData, rowIndex) {
    const rowProps = { data: componentData };
    const row = new Row(rowProps, this);
    const renderingComplete = row.render();

    if (row.$node) {
      this.state.rows.push(row);
    }

    if (!renderingComplete) {
      const isTheFirstRow = rowIndex === 0;
      const rowIsEmpty = !row.$node;

      if (isTheFirstRow && rowIsEmpty) {
        this.removeNode();
      }
    }

    return renderingComplete;
  }

  setInitialProps(props) {
    return { data: null, ...props };
  }

  setInitialState(sibling) {
    const siblingState = (!!sibling && sibling.state) || {};

    return {
      lastRowIndex: siblingState.lastRowIndex || 0,
      rows: [],
      startingRowIndex: siblingState.lastRowIndex || 0,
    };
  }
}
