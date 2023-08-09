const tape_filesel = document.getElementById("tape-filesel");
const tape_cards = document.getElementById("tape-cards");

tape_filesel.addEventListener("click", (e) => {
    if (e.target == tape_filesel)
        tape_filesel.close();
});

const mkTapeCard = (obj) => {
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

    const title = mkNode("h5", "card-title", obj.title);
    body.appendChild(title);

    const text = mkNode("p", "card-text", obj.desc);
    body.appendChild(text);

    const footer = mkNode("div", "card-footer");
    card.appendChild(footer);
    const small = mkNode("small", "text-body-secondary", obj.footer);
    footer.appendChild(small);

    // tape_cards.appendChild(card);


    return card;
};

const loadTapeCards = async (url) => {
    const response = await fetch(url);
    const tapes_obj = await response.json();
    for (const obj of tapes_obj.tapes) {
        const card = mkTapeCard(obj);
        tape_cards.appendChild(card);
    card.addEventListener("click", () => {
        tape_filesel.close("image/hl2/" + obj.filename);
    });
    };
};

loadTapeCards("image/hl2/images.json");

// addTapeCard({
//     "filename": "image/hl2/takopt.mp3",
//     "title": "TakOpt",
//     "desc": "Takarmány-optimalizáló segédprogram",
//     "footer": "1:59"
// });
