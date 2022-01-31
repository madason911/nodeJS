const express = require("express");
const chalk = require("chalk");
const path = require("path");

const yargs = require("yargs");
const pkg = require("./package.json");

const {
  addNote,
  getNotes,
  removeNote,
  updateNote,
  printNotes,
} = require("./notes.controller");

const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
  });
});

app.post("/", async (req, res) => {
  await addNote(req.body.title);
  console.log(req.body);
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: true,
  });
});

app.delete("/:id", async (req, res) => {
  await removeNote(req.params.id);
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
  });
});

app.put("/:id", async (req, res) => {
  await updateNote(+req.body.id, req.body.title);
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false,
  });
});

if (process.argv.length === 2) {
  app.listen(port, () => {
    console.log(chalk.green(`Server has been started on port ${port}...`));
  });
}

yargs.version(pkg.version);

yargs.command({
  command: "add",
  describe: "Add new note to list",
  builder: {
    title: {
      type: "string",
      describe: "Note title",
      demandOption: true,
    },
  },
  handler({ title }) {
    addNote(title);
  },
});

yargs.command({
  command: "list",
  describe: "Print all notes",
  async handler() {
    printNotes();
  },
});

yargs.command({
  command: "remove",
  describe: "Remove note by id",
  builder: {
    id: {
      type: "string",
      describe: "Note uniq id",
      demandOption: true,
    },
  },
  async handler({ id }) {
    removeNote(id);
  },
});

yargs.command({
  command: "edit",
  describe: "Edit note by id",
  builder: {
    id: {
      type: "string",
      describe: "Note uniq id",
      demandOption: true,
    },
  },
  async handler({ id, title }) {
    updateNote(id, title);
  },
});

yargs.parse();
