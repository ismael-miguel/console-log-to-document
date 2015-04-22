# console-log-to-document
Provides the output of `console.log()` into the document.

## How to use

This is actually really easy to use!

1- Get either the minified/packed version or the plain version to study and change code,

2- Include the files in your HTML pages or copy-paste the code directly into your browser's console,

3- Add `console._RELAY_TO_DOC = true;` to your Javascript.

4- Use the `console.log()` on the way you intended!

5- You have finished all the steps to use the code!<br>
   No more opening the console! (but the output is still redirected there)

## Advanced usage

There are a few settings that you can use to change the functionality of your code.

- `console._RELAY_TO_DOC = true;` or `console._RELAY_TO_DOC = elem;`<br>
  If an element is provided, the console messages will be placed in it.<br>
  If it simply is another truthy value, then the elements are added to `document`.

- `console._USE_JSON = true;`<br>
  Enables or disables a simple JSON output. Nothing fancy will be shown: just what is returned by `JSON.stringify()`.

- `console._SHOW_COOL_NUMBERS = true;`<br>
  Shows the number in binary, octal and hexadecimal.<br>
  E.g.: `5 (0x5, 0o5, 0b101)`

- `console._SHOW_TYPES = true;`<br>
  Shows the datatype of a value<br>
  E.g.: `(number) 5`

- `console._SHOW_STRING_LENGTH = true;`<br>
  Shows the length of a string<br>
  E.g.: `"Test" (length: 4)`

Remember, if you enable `console._USE_JSON = true;`, all the other options won't take effect. Except the 1st, obviously.<br>
All the changes made will only be reflected on the next time you run `console.log()`.

## Methods

2 Useful methods are added to the console:

- `console._restore_old_log()`<br>
  Restores the `console.log()` to the value it was *before*  running this code.

- `console._restore_redirect_log()`<br>
  Restores to the custom `console.log()`.

- `console._restore_old_clear()`<br>
  Restores the `console.clear()` to the value it was *before*  running this code.

- `console._restore_redirect_clear()`<br>
  Restores to the custom `console.clear()`.

## Writting to the console

It is really easy to write into the console:<br>
Simply call `console.log()` and you are set!

It has nearly-identical to the native console output.<br>
Also, this supports formatted strings (in a very basic form):

- `%s` - Will parse the next argument as a string.
- `%i` or `%d` - Will parse the next argument as an integer.
- `%f` - Will parse the next argument as a floating-point number.
- `%f.<size>` - **Non-standard** Will parse the next argument as a floating number with `<size>` decimal digits.
- `%c` - **Not supported**

Using `console.clear()` will delete the messages that were added to the element/document.<br>
This is enabled by default.

This also catches uncaught errors and exceptions.<br>
All credits due to the user <a href="http://meta.stackexchange.com/users/159427/canon">@canon</a> on http://meta.stackexchange.com/ for this, on <a href="http://meta.stackexchange.com/a/242491/289125">his awesome code</a><br>
He was kind enough to let me use his code!
