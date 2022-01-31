document.addEventListener("click", (event) => {
  if (event.target.dataset.type === "remove") {
    const id = event.target.dataset.id;

    remove(id).then(() => {
      event.target.closest("li").remove();
    });
  }

  if (event.target.dataset.type === "update") {
    const id = event.target.dataset.id;

    let result = prompt(
      "Введите новое значение ",
      event.target.closest("li").firstChild.textContent.trim()
    );

    if (result) {
      const data = {
        title: result,
        id: id,
      };

      fetch(`/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(() => {
          event.target.closest("li").firstChild.textContent = result;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

async function remove(id) {
  await fetch(`/${id}`, { method: "DELETE" });
}
