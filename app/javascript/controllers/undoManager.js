var wpd = wpd || {};

wpd.UndoManager = class {
    constructor() {
        this._actions = [];
        this._actionIndex = 0;
    }

    canUndo() {
        return this._actionIndex > 0 && this._actions.length >= this._actionIndex;
    }

    undo() {
        if (!this.canUndo()) {
            return;
        }
        this._actionIndex--;
        let action = this._actions[this._actionIndex];
        action.undo();
        this.updateUI();
    }

    canRedo() {
        return this._actions.length > this._actionIndex;
    }

    redo() {
        if (!this.canRedo()) {
            return;
        }
        let action = this._actions[this._actionIndex];
        action.execute();
        this._actionIndex++;
        this.updateUI();
    }

    reapply() {
        if (!this.canUndo()) {
            return;
        }
        for (let i = 0; i < this._actionIndex; i++) {
            let action = this._actions[i];
            action.execute();
        }
        this.updateUI();
    }

    insertAction(action) {
        if (!(action instanceof wpd.ReversibleAction)) {
            console.error("action must be a wpd.ReversibleAction!");
            return;
        }
        if (this.canRedo()) {
            // drop all possible future actions
            this._actions.length = this._actionIndex;
        }
        this._actions.push(action);
        this._actionIndex++;
        this.updateUI();
    }

    clear() {
        this._actions = [];
        this._actionIndex = 0;
        this.updateUI();
    }

    updateUI() {
        // enable/disable undo and redo buttons
        const $undo = document.getElementById("image-editing-undo");
        const $redo = document.getElementById("image-editing-redo");

        if (this.canUndo()) {
            $undo.disabled = false;
        } else {
            $undo.disabled = true;
        }

        if (this.canRedo()) {
            $redo.disabled = false;
        } else {
            $redo.disabled = true;
        }
    }
};