# jQuery.simulate()

How to build and test jQuery Simulate
----------------------------------

First, get a copy of the git repo by running:

```shell
git clone git://github.com/jquery/jquery-simulate.git
```

Enter the directory and install the node dependencies:

```shell
cd jquery-simulate && npm install
```

Make sure you have `grunt` installed by testing:

```shell
grunt -version
```

If not, run:

```shell
npm install -g grunt
```

To run tests locally, run `grunt`, and this will run the tests in PhantomJS.

You can also run the tests in a browser by navigating to the `test/` directory, but first run `grunt` to install submodules.