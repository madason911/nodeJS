document.addEventListener("click", (event) => {
  if (event.target.dataset.type === "remove") {
    const id = event.target.dataset.id;

    remove(id).then(() => {
      event.target.closest("li").remove();
    });
  }

  if (event.target.dataset.type === "update") {
    const { target } = event;
    const id = target.dataset.id;
    let currentContent = target.closest("li").firstChild.textContent.trim();

    const curItem = target.closest("li");
    const buttons = curItem.querySelectorAll("button");
    buttons.forEach((button) => {
      button.style.display = "none";
    });

    curItem.innerHTML = `<input class="edit_input" value=${currentContent}></input><div class="buttons_box">
      <button
        class="btn btn-success"
        data-type="save"
      >
        Сохранить
      </button>
      <button
        class="btn btn-danger"
        data-type="cancel"
      >
        Отменить
      </button>`;

    curItem.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", (event) => {
        if (
          event.target.dataset.type === "save" ||
          event.target.dataset.type === "cancel"
        ) {
          if (event.target.dataset.type === "save") {
            currentContent = document.querySelector(".edit_input").value;

            const data = {
              title: currentContent,
              id: id,
            };

            fetch(`/${id}`, {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }).catch((err) => {
              console.log(err);
            });
          }

          curItem.innerHTML = `${currentContent}
            <div class="buttons_box">
              <button
                class="btn btn-primary"
                data-type="update"
                data-id=${id}
              >
                Редактировать
              </button>
              <button
                class="btn btn-danger"
                data-type="remove"
                data-id=${id}
              >
                &times;
              </button>
            </div>`;
        }
      })
    );
  }
});

async function remove(id) {
  await fetch(`/${id}`, { method: "DELETE" });
}
