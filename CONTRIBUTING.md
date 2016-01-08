# Contributing

## Getting Started

```console
cd path/to/this/repo
npm link
npm install -g npm-cache    # Used by 'npm test' to reduce test-times significantly

# Now test it in a new folder
cd ..
mkdir test-app
cd test-app
yo confit

```

## Yeoman tips

Yeoman generators have [several key methods](http://yeoman.io/authoring/running-context.html) that will be called in a specific order. Respect this order.

Yeoman cannot **read** the config out of `Gruntfile.js`. Therefore, if we want to persist the state of the generator (which we do),
we **must** use `generator.config.set('key', 'value')` and `generator.config.get('key')` to read it back.
 
Aim to keep the code related to the task-runner choice (currently gruntJS) in a file separate to the generator. 
