// Event emitter for editor resize events
class EditorEventEmitter extends EventTarget {
  emitResize() {
    this.dispatchEvent(new Event('resize'));
  }
}

export const editorEvents = new EditorEventEmitter();
