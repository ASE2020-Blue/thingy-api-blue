## `AfterAll` problem
In debug mode, we could easily experience out of memory errors from **Sqlite**. However, this
error is misleading as in most cases, it is due to the connection not being open or already closed.

This was experienced with `jest`'s `afterAll` clause being called before the tests being completed (in which we might 
be debugging with breakpoints).

### Workaround
While experiencing with this error, command out the `afterAll` clause of the desire test. However, this will make
the test hang and not exit properly, therefore the drawback will be to have to exit the tests with a kill signal 
(either the stop action in the IDE or `CTRL-C` in a cli).
