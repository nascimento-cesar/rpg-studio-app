import snarkdown from "snarkdown";

export default class Paragraph {
  constructor(props, parent, sibling = null) {
    this.$node = this.createNode(props, sibling);
    this.parent = parent;
    this.props = this.setInitialProps(props);
    this.sibling = sibling;
    this.state = this.setInitialState(props, sibling);
  }

  render() {
    this.appendToParent();

    this.writeAllWords();

    if (!this.detectHeightOverflow()) {
      this.state.lastWordIndex = this.state.words.length - 1;
      return true;
    }

    this.writeFirstWord();

    if (this.detectHeightOverflow()) {
      this.removeNode();
      return false;
    }

    return this.iterativelyWriteWords();
  }

  appendToParent() {
    this.parent.$node.appendChild(this.$node);
  }

  createNode(props, sibling) {
    const $node = document.createElement("P");
    $node.classList.add("paragraph");

    if (props.data.id) {
      $node.setAttribute("data-id", props.data.id);
    }

    if (sibling) {
      $node.classList.add("sibling");
    }

    return $node;
  }

  detectHeightOverflow() {
    return this.parent.detectHeightOverflow();
  }

  iterativelyWriteWords() {
    for (
      this.state.lastWordIndex;
      this.state.lastWordIndex < this.state.words.length;
      this.state.lastWordIndex++
    ) {
      this.writeWordsRange(
        this.state.startingWordIndex,
        this.state.lastWordIndex + 1
      );

      if (this.detectHeightOverflow()) {
        this.writeWordsRange(
          this.state.startingWordIndex,
          this.state.lastWordIndex
        );
        return false;
      }
    }

    return true;
  }

  removeNode() {
    this.$node.remove();
    delete this.$node;
  }

  setInitialProps(props) {
    return { data: null, ...props };
  }

  setInitialState(props, sibling) {
    const siblingState = (!!sibling && sibling.state) || {};
    const convertedText = snarkdown(props.data.text);

    return {
      startingWordIndex: siblingState.lastWordIndex || 0,
      lastWordIndex: siblingState.lastWordIndex || 0,
      words: convertedText.split(" "),
    };
  }

  writeAllWords() {
    this.writeWordsRange(this.state.startingWordIndex, this.state.words.length);
  }

  writeFirstWord() {
    this.writeWordsRange(
      this.state.startingWordIndex,
      this.state.startingWordIndex + 1
    );
  }

  writeWordsRange(startingWordIndex, lastWordIndex) {
    const text = this.state.words
      .slice(startingWordIndex, lastWordIndex)
      .join(" ");
    this.$node.innerHTML = text;
  }
}
