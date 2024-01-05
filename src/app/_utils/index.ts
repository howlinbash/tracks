export const page = (elem: HTMLDivElement | HTMLTableSectionElement, dir: 0 | 1) => {
  elem.scrollBy({
    top: dir ? elem.clientHeight : -elem.clientHeight,
    behavior: 'smooth'
  });
}
