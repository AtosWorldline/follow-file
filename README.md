# follow-file

This module is designed to follow a file which is being appended to by
something like a syslog server. It will reopen the file if the file is 
truncated and recover from file being removed and recreated.

# Example

This module comes with a small command which will follow the
file, this is used for demonstration and testing purposes.

```
follow-file -f /var/log/syslog
```

# API 

As illustrated in the following example program this module can be used as an
endless stream. Note in this example I am using through to inject new
lines for presentations sake.

```js
ff(argv.file).pipe(through(function write(data) {
     log('data', data)
     this.emit('data', data + '\n')
   },
   function end() { //optional
     log('end')
     this.emit('end')
   }))
   .pipe(process.stdout)

```

Copyright &copy; 2013 Mark Wolfe

MIT License
