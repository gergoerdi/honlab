const tape_filesel = document.getElementById("tape-filesel");
const tape_cards = document.getElementById("tape-cards");

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

const createCard = (title, text, footer) => {
    const mkNode = (tag, cls, s) => {
        const node = document.createElement(tag);
        node.classList.add(cls);
        if (s)
            node.appendChild(document.createTextNode(s));
        return node;
    };

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
    const mkNode = (tag, cls, s) => {
        const node = document.createElement(tag);
        node.classList.add(cls);
        if (s)
            node.appendChild(document.createTextNode(s));
        return node;
    };

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
        tape_cards.appendChild(card);

        link.href = obj.filename;
        link.download = obj.filename.substring(obj.filename.lastIndexOf('/')+1);

        card.addEventListener("click", () => {
            tape_filesel.close(obj.filename);
        });
    };
};

loadTapeCards("image/hl2/images.json");
// (() => {
//     const footer = null;
//     const card = createCard("New tape", "", footer);
//     tape_cards.appendChild(card);
// })();
