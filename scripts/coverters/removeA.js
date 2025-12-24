document.querySelectorAll("a").forEach((a) => {
  const span = document.createElement("span");
  span.innerHTML = a.innerHTML;
  a.replaceWith(...span.childNodes);
});
