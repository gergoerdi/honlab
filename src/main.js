setupAnim(machine);
setupTape(deck);

function run_for(lim, verbose) {
    let cnt = 0;
    while (cnt < lim)
    {
        cnt += machine.step();
        if (verbose)
            console.log(cpu.getState().pc.toString(16));
    };

    
}

function foo() {
    run_for(1_000_000);
    cpu.interrupt(true);
    run_for(1045, true);
}
