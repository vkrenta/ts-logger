# Typescript Logger

Alternative logger to winston (winston module doesn't resolve in typescript projects)

```
npm i https://github.com/vkrenta/ts-logger
```

Create new logger

```typescript
import { Logger } from 'ts-logger';

const logger = new Logger()
  .Console()
  .setFormat(
    ({ label, timestamp, level }) =>
      `[${timestamp.toJSON()}][${level.toUpperCase()}]${
        !!label ? `[${label}]` : ''
      }`
  );
```

You can disable logs in production mode

```typescript
logger.Console(process.env.NODE_ENV !== 'production');
```

Connecting output files

```typescript
logger.File('a.txt').File({ level: 'error', path: 'error.txt' });
```

There are next output **level**s: `'log'`, `'error'`, `'info'`, `'warn'`</br>
To out messages you can use these 4 methods

```typescript
const dbError = {
  code: 8000,
  source: null,
  flags: ['r', 'w'],
  name: 'Connection Error',
};

logger
  .log('Simple message')
  .log({ label: 'Label', message: 'Log with label' })
  .info('This is info level')
  .warn({
    label: 'Promise warn',
    message: { text: 'unresolved promise', code: 600 },
  })
  .error({ label: 'DBError', message: dbError });
```

Output

```log
[2020-09-09T15:59:15.652Z][LOG] Simple message
[2020-09-09T15:59:15.669Z][LOG][Label] Log with label
[2020-09-09T15:59:15.717Z][INFO] This is info level
[2020-09-09T15:59:15.737Z][WARN][Promise warn] { text: 'unresolved promise', code: 600 }
[2020-09-09T15:59:15.821Z][ERROR][DBError] {
  code: 8000,
  source: null,
  flags: [ 'r', 'w' ],
  name: 'Connection Error'
}
```
