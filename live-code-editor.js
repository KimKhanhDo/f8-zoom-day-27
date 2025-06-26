document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.querySelector('#code-input');
    const previewFrame = document.querySelector('#preview-frame');
    const contextMenu = document.querySelector('#context-menu');
    const deleteBtn = contextMenu.querySelector('.delete');
    const copyBtn = contextMenu.querySelector('.copy');
    const pasteBtn = contextMenu.querySelector('.paste');

    let clipboardValue = '';

    window.addEventListener('beforeunload', handleBeforeUnload);
    codeInput.addEventListener('input', updatePreview);
    document.addEventListener('contextmenu', showContextMenu);
    document.addEventListener('mousedown', hideContextMenuIfClickedOutside);
    contextMenu.addEventListener('click', handleContextMenuClick);

    // ====== FUNCTION DEFINITIONS ======
    function handleBeforeUnload(e) {
        if (!codeInput.value.trim()) return;
        e.returnValue = 'Are you sure you want to leave?';
    }

    function updatePreview() {
        previewFrame.srcdoc = codeInput.value.trim();
    }

    function showContextMenu(e) {
        console.log(e);

        if (e.target.closest('.preview')) return;

        e.preventDefault();
        contextMenu.hidden = false;

        const { clientX: x, clientY: y } = e;
        Object.assign(contextMenu.style, calculateMenuPosition(x, y));

        const hasSelection =
            codeInput.selectionStart !== codeInput.selectionEnd;

        // blur when there's no text highlight
        if (!hasSelection && document.activeElement === codeInput) {
            codeInput.blur();
        }
    }

    function hideContextMenuIfClickedOutside(e) {
        if (!contextMenu.contains(e.target)) {
            contextMenu.hidden = true;
        }
    }

    function handleContextMenuClick(e) {
        const clicked = e.target.closest('li');

        if (clicked === deleteBtn) {
            handleDelete();
        }

        if (clicked === copyBtn) {
            handleCopy();
        }

        if (clicked === pasteBtn) {
            handlePaste();
        }

        contextMenu.hidden = true;
    }

    function handleDelete() {
        codeInput.value = '';
        previewFrame.srcdoc = '';
    }

    function handleCopy() {
        const selected = codeInput.value.substring(
            codeInput.selectionStart,
            codeInput.selectionEnd
        );
        clipboardValue = selected || codeInput.value;
    }

    function handlePaste() {
        codeInput.value += clipboardValue;
        previewFrame.srcdoc = codeInput.value;
    }

    function calculateMenuPosition(mouseX, mouseY) {
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;

        const isOverflowBottom = mouseY + menuHeight > window.innerHeight;
        const isOverflowRight = mouseX + menuWidth > window.innerWidth;

        return {
            top: isOverflowBottom ? `${mouseY - menuHeight}px` : `${mouseY}px`,
            left: isOverflowRight ? `${mouseX - menuWidth}px` : `${mouseX}px`,
        };
    }
});
