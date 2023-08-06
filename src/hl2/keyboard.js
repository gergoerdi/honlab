const keymap = [
    [ "ShiftLeft", null,          null,     null,     null,     "ShiftRight",  null,     null        ],
    [ "Space",    "BracketRight", null,     "Equal",  null,     "Enter",       null,     "Backslash" ],
    [ "Digit0",   "Digit1",       "Digit2", "Digit3", "Digit4", "Digit5",      "Digit6", "Digit7"    ],
    [ "Digit8",   "Digit9",       "Minus",  "Quote",  "Comma",  "BracketLeft", "Period", "Slash"     ],
    [ null,       "KeyA",         "KeyB",   "KeyC",   "KeyD",   "KeyE",        "KeyF",   "KeyG"      ],
    [ "KeyH",     "KeyI",         "KeyJ",   "KeyK",   "KeyL",   "KeyM",        "KeyN",   "KeyO"      ],
    [ "KeyP",     "KeyQ",         "KeyR",   "KeyS",   "KeyT",   "KeyU",        "KeyV",   "KeyW"      ],
    [ "KeyX",     "KeyY",         "KeyZ",   null,     null,     "Semicolon",    null,     null       ]
];

function read_row(keystate, row) {
    let val = 0;
    for (key of row) {
        val >>= 1;
        if (!(key && keystate[key]))
            val |= 0x80;
    }
    return val;
}

function keyboard_byte(keystate, addr) {
    let val = 0xff;
    
    addr &= 0xff;
    for (row of keymap) {
        if ((addr & 1) == 0)
            val &= read_row(keystate, row);
        addr >>= 1;
    }

    return val;
}
