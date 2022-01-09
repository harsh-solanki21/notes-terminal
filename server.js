const yargs = require('yargs')
const clc = require('cli-color')
const fs = require('fs')
const notes = JSON.parse(fs.readFileSync('notes.json'))

// Add Notes
const addNotes = (title, body) => {
  let exists = false
  notes.forEach((note) => {
    if (note.title.toLowerCase() === title.toLowerCase()) {
      exists = true
    }
  })
  if (exists === false) {
    notes.push({ title, body })
    fs.writeFile('notes.json', JSON.stringify(notes), () => {
      console.log(clc.green.bold('New note has been created'))
    })
  } else {
    console.log(clc.red.bold('ERROR!! Note already exists.'))
  }
}
yargs.command({
  command: 'add',
  describe: 'Add notes to the list',
  builder: {
    title: {
      describe: 'title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'body',
      demandOption: true,
      type: 'string',
    },
  },

  handler(argv) {
    addNotes(argv.title, argv.body)
  },
})

// Delete Notes
const removeNotes = (title) => {
  let exists = false
  notes.forEach((note) => {
    if (note.title.toLowerCase() === title.toLowerCase()) {
      exists = true
    }
  })
  if (exists === true) {
    let newList = notes.filter((note) => {
      return note.title.toLowerCase() !== title.toLowerCase()
    })
    fs.writeFile('notes.json', JSON.stringify(newList), () => {
      console.log(clc.blue.bold(title + ' note has been removed'))
    })
  } else {
    console.log(clc.red.bold(title + " note doesn't exist"))
    console.log(clc.cyan.bold(' List of existing notes:'))
    displayList()
  }
}
yargs.command({
  command: 'remove',
  describe: 'remove a note from the list',
  builder: {
    title: {
      describe: 'title',
      demandOption: true,
      type: 'string',
    },
  },

  handler(argv) {
    removeNotes(argv.title)
  },
})

// Display all notes
const displayList = () => {
  if (notes.length !== 0) {
    console.log(clc.bold.magenta.underline(' My Notes:'))
    notes.forEach((note) => {
      console.log(clc.magentaBright('> ') + clc.yellow(note.title))
    })
  } else {
    console.log(clc.bold.red('List is empty'))
  }
}

yargs.command({
  command: 'list',
  describe: 'display all the notes',

  handler(argv) {
    displayList()
  },
})

// Display notes Body
const readNotes = (title) => {
  let exists = false
  notes.forEach((note, index) => {
    if (note.title.toLowerCase() === title.toLowerCase()) {
      console.log(clc.bold.blue(note.title + ':'))
      console.log(clc.bold.green(notes[index].body))
      exists = true
    }
  })
  if (exists === false) {
    console.log(clc.bold.red(title + ' note does not exist!!'))
    console.log(clc.bold.cyan('List of existing notes'))
    displayList()
  }
}

yargs.command({
  command: 'read',
  describe: 'display body of the note',
  builder: {
    title: {
      describe: 'title',
      demandOption: true,
      type: 'string',
    },
  },

  handler(argv) {
    readNotes(argv.title)
  },
})

yargs.parse()
