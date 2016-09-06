# now-realias

This is a quick utility I wrote that helps with updating the alias on your [`now`](https://zeit.co/now) deployed projects.

You will need to have manually set an initial alias on your deployment, but after that, if you run this utility in the project directory, it will update the alias from the penultimate deploy to the latest deploy.

Note that the code is extremely simple, so it doesn't do anything more than described above.

## Installation

Preferred installation as a global utility, though obviously you can include as a `devDependency` for continuous integration:

```bash
npm install -g now-realias
```

## Usage

From the project directory that you previously ran `now` in, you can run (without any arguments):

```bash
now-realias
```

Note that `now-realias` will detect your `NOW_TOKEN` from either your `~/.now.json` or your environment.

That's it.

## License

- [MIT](https://rem.mit-license.org)
