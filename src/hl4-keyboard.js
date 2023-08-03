const keymap = [
    [ "ArrowDown", "ArrowUp",   "ArrowRight",   "ArrowLeft"   ],
    [ "Space",     "Enter",     null,           null          ],
    [ null,        "ShiftLeft", "ShiftRight",   "AltRight"    ],
    [ null,        "F2",        "F1",           null          ],
    [ "Digit0",    "Digit1",    "Digit2",       "Digit3"      ],
    [ "Digit4",    "Digit5",    "Digit6",       "Digit7"      ],
    [ "Digit8",    "Digit9",    "Minus",        "Comma"       ],
    [ null,        null,        null,           null          ], // TODO
    [ null,        "KeyA",      null,           "KeyB"        ], // TODO
    [ "KeyC",      "KeyD",      "KeyE",         "Semicolon"   ],
    [ "KeyF",      "KeyG",      "KeyH",         "KeyI"        ],
    [ "KeyJ",      "KeyK",      "KeyL",         "KeyM"        ],
    [ "KeyN",      "KeyO",      "BracketRight", "BracketLeft" ],
    [ "KeyP",      "KeyQ",      "KeyR",         "KeyS"        ],
    [ "KeyT",      "KeyU",      null,           "KeyV"        ],
    [ "KeyW",      "KeyX",      "KeyY",         "KeyZ"        ]
];
    
function keyboard_byte(keystate, addr) {
    const keys = keymap[addr & 0x0f];
    let val = 0;
    for (key of keys) {
        val >>= 1;
        if (!(key && keystate[key]))
            val |= 0b1000;
    }
    return val;
}
