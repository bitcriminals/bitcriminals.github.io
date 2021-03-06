let currentTerminal, directoryStructure = {};

console.log("%cHello", "font-size: 40px");
console.log("%cLooks like you are on the right track", "font-size: 20px");
console.log("%cHere's your way forward.\nRun sayhello", "font-size: 14px");

function sayhello() {
    console.log("Hello. But you said it in the wrong place. https://www.latlmes.com/tech/debug-js-1");
    openTerminal();
}

function command_sayhello() {
    return "Hey you did the right thing.<br>Now go and explore!<br>You are just one step from getting the flag!";
}

function command_ls(params) {
    if ( !params ) {
        return Object.keys(directoryStructure).filter(fileName => fileName[0] != '.').join('\t');
    }

    if ( params[0] != '-' ) {
        return "ls: invalid arguments";
    }

    switch ( params.slice(1) ) {
        case 'a':
            return Object.keys(directoryStructure).join('\t');
            break;
        default:
            return "ls: it's not that powerful yet";
    }
}

function command_cat(fileName) {
    if ( !fileName || fileName[0] == '-' ) {
        return "cat: invalid arguments";
    }

    let currentPath = directoryStructure;
    fileName.split('/').every(transverse => {
        if ( transverse == '.' ) {
            return true;
        }
        if ( typeof currentPath != 'object' ) {
            currentPath = `cat: ${fileName}: Not a directory`;
            return false;
        }
        currentPath = currentPath[transverse];
        if ( !currentPath ) {
            currentPath = `cat: ${fileName}: No such file or directory`;
            return false;
        }
        return true;
    });

    if ( typeof currentPath != 'string' ) {
        currentPath = `cat: ${fileName}: Not a file`;
    }
    return currentPath;
}

function initializeDirectory() {
    directoryStructure = {
        '.htaccess': 'This ain\'t an Apache server xD',
        '.itshardtoseeme': `Yay!<br>
        Welcome to BIT CRIMINALS!<br>
        Hope you have a lovely time here and<br>
        and if you are seeing this in the source code,<br>
        you wasted all my efforts!<br>
        i_have_seen_the_real_website<br>
        Here's the flag`
    };
}

function openTerminal() {
    document.querySelector('body').classList.add('show-terminal');
    setTimeout(() => {
        document.querySelector('header').style.display = 'none';
        document.querySelector('main').style.display = 'none';
        document.querySelector('footer').style.display = 'none';
        showWelcomeMessage();
        addCommandInput();
    }, 600);
    initializeDirectory();
}

function showWelcomeMessage() {
    let terminalWrapper = document.createElement('div');
    terminalWrapper.classList.add('terminal-wrapper');
    terminalWrapper.innerHTML = `<div class="intro-head">
        (<span class="terminal-red">Message from ReversedEyes</span>)
    </div>
    <div class="intro-body">
        <br>
        Hello!<br>
        This is the real website!<br>
        A lightweight Kali on the web.<br>
        Has some basic Linux commands.
        <br><br>
    </div>
    <div class="intro-foot">
        (Now you can say hello!)
    </div>`;
    document.querySelector('.terminal').append(terminalWrapper);
}

function showResult(result) {
    let terminalWrapper = document.createElement('div');
    terminalWrapper.classList.add('terminal-wrapper');
    terminalWrapper.innerHTML = result;
    document.querySelector('.terminal').append(terminalWrapper);   
}

function keyOverrider(event) {
    if ( 
        event.key == "ArrowLeft" || 
        event.key == "ArrowRight" || 
        event.key == "ArrowUp" || 
        event.key == "ArrowDown" ||
        event.key == "Home" ||
        event.key == "End"
    ) {
        event.preventDefault();
    } else if ( event.key == 'Enter' ) {
        executeCommand();
    }
}

function executeCommand() {
    let command = currentTerminal.querySelector('input').value;
    currentTerminal.querySelector('input').remove();
    currentTerminal.querySelector('.terminal-cursor').remove();

    command = command.trim().split(' ');
    let result = '';
    if ( command.length > 0 && command[0] != '' ) {
        if ( window[`command_${command[0]}`] ) {
            result = window[`command_${command[0]}`](...command.splice(1));
        } else {
            result = `${command[0]}: command not found`;
        }
        if ( result ) {
            showResult(result);
        }
    }
    
    addCommandInput();
}

function addCommandInput() {
    let terminalWrapper = document.createElement('div');
    terminalWrapper.classList.add('terminal-wrapper');
    terminalWrapper.innerHTML = `<div class="terminal-details"><span class="terminal-green">(</span><span class="terminal-blue">guest@BitCriminalsKali</span><span class="terminal-green">)-[</span>~<span class="terminal-green">]</span></div>
    <div class="terminal-command"><span class="terminal-blue">$ </span><span class="command"></span><span class="terminal-cursor"></span></div>
    <input type="text">`;
    document.querySelector('.terminal').append(terminalWrapper);
    currentTerminal = terminalWrapper;
    currentTerminal.querySelector('input').focus();
    currentTerminal.querySelector('input').addEventListener('input', updateCommand);
    currentTerminal.querySelector('input').addEventListener('keydown', keyOverrider);
    window.addEventListener('click', focusInput);
}

function updateCommand() {
    currentTerminal.querySelector('.command').innerText = currentTerminal.querySelector('input').value;
}

function focusInput() {
    currentTerminal.querySelector('input').focus();
}

function typerTitle() {
    let instance = new TypeIt('.landing-main--content--title', {
        strings: 'B',
        afterComplete: (step, instance) => {
            instance.destroy();
            typerContent();
        }
    })
    .options({speed: 150})
    .type('it ')
    .pause(300)
    .type('Criminals')
    .pause(400)
    .go();
}

function typerContent() {
    let instance = new TypeIt('.landing-main--content--content', {
        strings: 'A',
        afterComplete: (step, instance) => {
            instance.destroy();
        }
    })
    .options({speed: 80})
    .type(' bunch of people who like<br>')
    .pause(300)
    .options({speed: 100})
    .type('hacking')
    .pause(800)
    .options({speed: 200})
    .delete(7)
    .options({speed: 50})
    .type('committing crimes')
    .go();
}

window.addEventListener('load', () => {
    new Flickity( '.main-carousel', {
        cellAlign: 'left',
        contain: true,
        groupCells: true,
        pageDots: false
    });
    document.querySelector('body').classList.add('loaded');
    setTimeout(typerTitle, 500);
});