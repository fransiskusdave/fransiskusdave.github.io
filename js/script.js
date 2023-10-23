const STORAGE_KEY = "BOOKSHELF_APPS";
const UPLOAD_EVENT = "upload_book";
const books = [];

document.addEventListener("DOMContentLoaded", function() {
    const inputForm = document.getElementById("bookInput-form");
    const searchForm = document.getElementById("bookSearch-form");
    const button = document.getElementById("btn");

    inputForm.addEventListener("submit", function(e) {
        e.preventDefault();
        addBook();
    });

    changeButton();

    searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
        searchBook();
    });

    if (checkStorage()) {
        loadData();
    }
});



document.addEventListener(UPLOAD_EVENT, function() {
    const belumBacaContainer = document.getElementsByClassName("unRead-list")[0];
    const sudahBacaContainer = document.getElementsByClassName("read-list")[0];

    belumBacaContainer.innerHTML = "";
    sudahBacaContainer.innerHTML = "";

    for (const item of books) {
        const buku = makeBook(item);

        if (!item.isCompleted) {
            belumBacaContainer.append(buku);
        } else {
            sudahBacaContainer.append(buku);
        }
    }
});

function checkStorage() {
    if (typeof (Storage) !== "undefined") {
        return true;
    } else {
        alert("Browser Anda tidak mendukung web storage");
        return false;
    }
}

function addBook() {
    const id = generateId();
    const judulBuku = document.getElementsByClassName("judulInput")[0].value;
    const penulis = document.getElementsByClassName("penulis")[0].value;
    const tahun = parseInt(document.getElementsByClassName("tahun")[0].value);
    let generateBuku;

    if (document.getElementById("sudahCheckbox").checked) {
        generateBuku = generateBook(id, judulBuku, penulis, tahun, true);
        books.push(generateBuku);
    } else {
        generateBuku = generateBook(id, judulBuku, penulis, tahun, false);
        books.push(generateBuku);
    } 

    document.dispatchEvent(new Event(UPLOAD_EVENT));
    saveBook();
}

function makeBook(buku) {
    const judul = document.createElement("h3");
    judul.innerText = buku.judul;

    const idBuku = document.createElement("p");
    idBuku.innerText = `id : ${buku.id}`

    const penulisBuku = document.createElement("p");
    penulisBuku.innerText = `Penulis : ${buku.penulis}`;

    const tahunBuku = document.createElement("p");
    tahunBuku.innerText = `Tahun : ${buku.tahun}`;

    const bukuContainer = document.createElement("div");
    bukuContainer.classList.add("buku");
    bukuContainer.append(judul, idBuku, penulisBuku, tahunBuku);
    bukuContainer.setAttribute("id", buku.judul);

    const hapusBuku = document.createElement("button");
    hapusBuku.classList.add("hapusBuku-button");
    hapusBuku.innerText = "Hapus Buku";

    hapusBuku.addEventListener("click", function() {
        removeBook(buku.judul);
    });

    if (buku.isCompleted) {
        const belumBaca = document.createElement("button");
        belumBaca.classList.add("belumBaca-button");
        belumBaca.innerText = "Belum Baca";
        belumBaca.addEventListener("click", function() {
            undoBook(buku.judul);
        });

        bukuContainer.append(belumBaca, hapusBuku);
    } else {
        const sudahBaca = document.createElement("button");
        sudahBaca.classList.add("sudahBaca-button");
        sudahBaca.innerText = "Sudah Baca";
        sudahBaca.addEventListener("click", function() {
            completedBook(buku.judul);
        });

        bukuContainer.append(sudahBaca, hapusBuku);
    }

    return bukuContainer;
}

function generateId() {
    return +new Date();
}

function generateBook(id, judul, penulis, tahun, isCompleted) {
    return {
        id,
        judul,
        penulis,
        tahun,
        isCompleted
    };
}

function changeButton() {
    const button = document.getElementById("btn");

    document.getElementById("sudahCheckbox").addEventListener("change", function() {
        if (this.checked) {
            button.value = "Sudah Dibaca";
        } else {
            button.value = "Belum Dibaca";
        }
    });
}

function completedBook(bukuJudul) {
    const buku = findBook(bukuJudul);

    if (buku == null) return;

    buku.isCompleted = true;
    document.dispatchEvent(new Event(UPLOAD_EVENT));
    saveBook();
}

function undoBook(bukuJudul) {
    const buku = findBook(bukuJudul);

    if (buku == null) return;

    buku.isCompleted = false;
    document.dispatchEvent(new Event(UPLOAD_EVENT));
    saveBook();
}

function removeBook(bukuJudul) {
    const buku = findBookIndex(bukuJudul);

    if (buku === -1) return;
    books.splice(buku, 1);
    document.dispatchEvent(new Event(UPLOAD_EVENT));
    saveBook();
}

function findBook(bukuJudul) {
    for (const item of books) {
        if (item.judul === bukuJudul) {
            return item;
        }
    }

    return null;
}

function findBookIndex(bukuJudul) {
    for (index in books) {
        if (books[index].judul === bukuJudul) {
            return index;
        }
    }

    return -1;
}

function searchBook() {
    const inputSearch = document.getElementById("judulSearch").value;
    const bukuContainer = document.getElementsByClassName("buku");
    for (const item of bukuContainer) {
        if (!item.id.includes(inputSearch)) {
            item.setAttribute("hidden", true);
        } else {
            item.removeAttribute("hidden");
        }
    }
}

function saveBook() {
    if (checkStorage()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    let book = JSON.parse(data);

    if (book !== null) {
        for (const item of book) {
            books.push(item);
        }
    }

    document.dispatchEvent(new Event(UPLOAD_EVENT));
}