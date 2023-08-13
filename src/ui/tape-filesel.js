const tape_filesel = document.getElementById("tape-filesel");
const tape_cards = document.getElementById("tape-cards");
const tape_new = document.getElementById("tape-new");

tape_filesel.addEventListener("click", (e) => {
    if (e.target != tape_filesel) return;

    const rect = e.target.getBoundingClientRect();
    const clicked_in_dialog = (
        rect.top <= e.clientY &&
            e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX &&
            e.clientX <= rect.left + rect.width
    );

    if (!clicked_in_dialog)
        tape_filesel.close();
});

const tape_selected = (tape) => {
    tape_filesel.dispatchEvent(new CustomEvent("tape_selected", {
        detail: tape,
        bubbles: false,
        cancelable: false,
        composed: false
    }));
};

const mkNode = (tag, cls, s) => {
    const node = document.createElement(tag);
    node.classList.add(cls);
    if (s)
        node.appendChild(document.createTextNode(s));
    return node;
};

const createCard = (title, text, footer) => {
    const card = mkNode("div", "card");

    const body = mkNode("div", "card-body");
    card.appendChild(body);

    body.appendChild(mkNode("h5", "card-title", title));
    body.appendChild(mkNode("p", "card-text", text));

    if (footer) {
        const footer_div = mkNode("div", "card-footer");
        card.appendChild(footer_div);
        footer_div.appendChild(footer);
    }

    return card;
}

const mkTapeCard = (obj) => {
    const footer = mkNode("div", "d-flex");
    footer.classList.add("justify-content-between");
    footer.appendChild(mkNode("small", "text-body-secondary", obj.footer));

    const linksmall = mkNode("small", "text-body-secondary");
    footer.appendChild(linksmall);

    const link = mkNode("a", "card-link", "Download");
    linksmall.appendChild(link);
    link.href = "#";

    link.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    const card = createCard(obj.title, obj.desc, footer);

    return { card, link };
};

const loadTapeCards = async (url) => {
    const response = await fetch(url);
    const tapes_obj = await response.json();
    for (const obj of tapes_obj.tapes) {
        obj.filename = "image/hl2/" + obj.filename;

        const card_link = mkTapeCard(obj);
        const card = card_link.card;
        const link = card_link.link;
        tape_cards.insertBefore(card, tape_new);

        link.href = obj.filename;
        link.download = obj.filename.substring(obj.filename.lastIndexOf('/')+1);

        card.addEventListener("click", async () => {
            tape = await tape_from_file(obj.filename);
            tape_filesel.close();
            tape_selected(tape);
        });
    };
};

tape_new.addEventListener("click", () => {
    const tape = empty_tape();

    const obj = {
        filename: "new_tape.wav",
        title: "New Tape",       
    };

    const card_link = mkTapeCard(obj);
    const card = card_link.card;
    const link = card_link.link;
    tape_cards.insertBefore(card, tape_new);

    link.addEventListener("click", (event) => {
        const url = URL.createObjectURL(tape.render());
        link.href = url;
    });
    link.download = "new_tape.wav";

    card.addEventListener("click", () => {
        tape_filesel.close();
        tape_selected(tape);
    });
});

loadTapeCards("image/hl2/images.json");

