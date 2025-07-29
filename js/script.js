const notesContainer = document.querySelector("#notes-container"); // para adicionar as notas no container de notas
const noteInput = document.querySelector("#note-content"); // input para adicionar uma nota
const noteAddBtn = document.querySelector(".add-note"); //botão que adiciona uma nota
const searchInput = document.querySelector("#search-input");
const exportBtn = document.querySelector("#exports-csv");

// Funções

// Mostra as notas no container de notas
// Pega as notas do localStorage e adiciona no container de notas
const showNotes = () => {
  cleanNotes();

  getNotes().forEach((note) => {
    const noteElement = createNote(note.id, note.content, note.fixed);

    notesContainer.appendChild(noteElement);
  });
};

const cleanNotes = () => {
  notesContainer.replaceChildren([]);
};

// Adiciona uma nova nota no container de notas
const addNote = () => {
  const notes = getNotes();

  const noteObject = {
    id: generateId(),
    content: noteInput.value,
    fixed: false,
  };

  const noteElement = createNote(noteObject.id, noteObject.content);
  notesContainer.appendChild(noteElement);

  notes.push(noteObject); //

  saveNotes(notes); // Salva as notas no localStorage como JSON

  noteInput.value = ""; // Limpa o input após adicionar a nota
};

// Cria uma nova nota de acordo com o addNote
const createNote = (id, content, fixed) => {
  const elementDiv = document.createElement("div");
  elementDiv.classList.add("note");
  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.placeholder = "Digite um texto...";
  elementDiv.appendChild(textarea);

  //Criar icone de fixar
  const pinIcon = document.createElement("i");
  pinIcon.classList.add(...["bi", "bi-pin"]);

  elementDiv.appendChild(pinIcon);

  //Criar icone de Deletar
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add(...["bi", "bi-x-lg"]);

  elementDiv.appendChild(deleteIcon);

  //Criar icone de Duplicar
  const duplicateIcon = document.createElement("i");
  duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);

  elementDiv.appendChild(duplicateIcon);

  if (fixed === true) {
    // Posso deixar apenas if(fixed)
    elementDiv.classList.add("fixed");
  }

  // Evento do elemento
  elementDiv.querySelector("textarea").addEventListener("keyup", (e) => {
    const noteContent = e.target.value;

    updateNote(id, noteContent);
  });

  // Eventos do Icones
  elementDiv.querySelector(".bi-pin").addEventListener("click", () => {
    toggleFixNote(id);
  });

  elementDiv.querySelector(".bi-x-lg").addEventListener("click", () => {
    deleteNote(id, elementDiv);
  });

  elementDiv
    .querySelector(".bi-file-earmark-plus")
    .addEventListener("click", () => {
      duplicateNote(id);
    });

  return elementDiv;
};

const toggleFixNote = (id) => {
  const notes = getNotes();

  const targetNote = notes.filter((note) => note.id === id)[0];

  targetNote.fixed = !targetNote.fixed;

  saveNotes(notes);

  showNotes();
};

const deleteNote = (id, element) => {
  const notes = getNotes().filter((note) => note.id !== id);

  saveNotes(notes);

  notesContainer.removeChild(element);
};

const duplicateNote = (id) => {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];

  const noteObject = {
    id: generateId(),
    content: targetNote.content,
    fixed: false,
  };

  const noteElement = createNote(
    noteObject.id,
    noteObject.content,
    noteObject.fixed
  );
  notesContainer.appendChild(noteElement);
  notes.push(noteObject);
  saveNotes(notes);
};

const updateNote = (id, newContent) => {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];

  targetNote.content = newContent;

  saveNotes(notes);
};

const searchNote = (search) => {
  const searchResult = getNotes().filter((notes) =>
    note.content.includes(search)
  );

  if (search !== "") {
    cleanNotes();

    searchNote.forEach((note) => {
      const noteElement = createNote(note.id, note.content);
      notesContainer.appendChild(noteElement);
    });

    return;
  }

  cleanNotes();
  showNotes();
};

// Gera um ID aleatório para a nota
const generateId = () => {
  return Math.floor(Math.random() * 2000); // 0 a 5K
};

// Pega as notas do localStorage e transforma em um array de objetos
// Se não houver notas, retorna um array vazio
const getNotes = () => {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1)); // Faz com q a nota fixada fique em primeiro

  return orderedNotes;
};

const exportData = () => {
  const notes = getNotes();

  const csvString = [
    ["ID", "Conteúdo", "Fixado?"],
    ...notes.map((note) => [note.id, note.content, note.fixed]),
  ]
    .map((e) => e.join(","))
    .join("\n");

  const element = document.createElement("a");

  element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

  element.target = "_blank";
  element.download = "notes.csv";
  element.click();
};

// Salva as notas no localStorage como JSON
const saveNotes = (notes) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

// Eventos
noteAddBtn.addEventListener("click", () => addNote());

searchInput.addEventListener("click", (e) => {
  const search = e.target.value;
  searchNote(search);
});

noteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addNote();
  }
});

exportBtn.addEventListener("click", () => {
  exportData();
});

// Inicialização / Mostra as notas ao carregar a página
showNotes();
