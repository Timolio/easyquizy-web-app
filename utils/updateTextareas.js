export default async function () {
    await nextTick(() => {
        document.querySelectorAll('textarea.resizable').forEach(el => {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        });
    });
}
