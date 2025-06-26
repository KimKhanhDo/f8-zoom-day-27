document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.querySelector('#code-input');
    const previewFrame = document.querySelector('#preview-frame');
    const contextMenu = document.querySelector('#context-menu');
    const deleteBtn = contextMenu.querySelector('.delete');
    const copyBtn = contextMenu.querySelector('.copy');
    const pasteBtn = contextMenu.querySelector('.paste');

    let clipboardValue = '';

    window.addEventListener('beforeunload', (e) => {
        if (!codeInput.value.trim()) return;
        e.returnValue = 'Are you sure you want to leave?';
    });

    codeInput.addEventListener('input', () => {
        previewFrame.srcdoc = codeInput.value.trim();
    });

    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.preview')) return;

        e.preventDefault();
        contextMenu.hidden = false;

        const { clientX: x, clientY: y } = e;
        Object.assign(contextMenu.style, calculateMenuPosition(x, y));

        const hasSelection =
            codeInput.selectionStart !== codeInput.selectionEnd;
        if (!hasSelection && document.activeElement === codeInput) {
            codeInput.blur();
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (!contextMenu.contains(e.target)) {
            contextMenu.hidden = true;
        }
    });

    contextMenu.addEventListener('click', (e) => {
        switch (e.target.closest('li')) {
            case deleteBtn: {
                codeInput.value = '';
                previewFrame.srcdoc = '';
                break;
            }

            case copyBtn: {
                const selected = codeInput.value.substring(
                    codeInput.selectionStart,
                    codeInput.selectionEnd
                );
                clipboardValue = selected || codeInput.value;
                break;
            }

            case pasteBtn: {
                codeInput.value += clipboardValue;
                previewFrame.srcdoc = codeInput.value;
            }
        }
        contextMenu.hidden = true;
    });

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
