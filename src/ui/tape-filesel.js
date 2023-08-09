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

    body.appendChild(mkNode("h5", "card-title", obj.title));
    body.appendChild(mkNode("p", "card-text", obj.desc));

    const footer = mkNode("div", "card-footer");
    card.appendChild(footer);
    const footerdiv = mkNode("div", "d-flex");
    footer.appendChild(footerdiv);
    footerdiv.classList.add("justify-content-between");
    footerdiv.appendChild(mkNode("small", "text-body-secondary", obj.footer));

    const linksmall = mkNode("small", "text-body-secondary");
    footerdiv.appendChild(linksmall);

    const link = mkNode("a", "card-link", "Download");
    linksmall.appendChild(link);
    link.href = obj.filename;
    link.download = obj.filename.substring(obj.filename.lastIndexOf('/')+1);

    link.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    return card;
};

const loadTapeCards = async (url) => {
    const response = await fetch(url);
    const tapes_obj = await response.json();
    for (const obj of tapes_obj.tapes) {
        obj.filename = "image/hl2/" + obj.filename;

        const card = mkTapeCard(obj);
        tape_cards.appendChild(card);

        card.addEventListener("click", () => {
            tape_filesel.close(obj.filename);
        });
    };
};

loadTapeCards("image/hl2/images.json");
