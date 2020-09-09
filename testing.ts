import { Logger, Input } from '.';

const log = new Logger()
  .Console()
  .setFormat((input: Input) => {
    let text: string = `[${input.timestamp.toJSON()}][${input.level.toUpperCase()}]`;
    if (input.label) {
      text += `[${input.label.toUpperCase()}]`;
    }
    return text;
  })
  .File('./a.txt')
  .File({ level: 'error', path: './error.txt' });

log.info('message').error({
  label: 'DBError',
  message: {
    code: 8000,
    name: 'Connection error',
    message: 'Unable to connect to DB. Reconnect in 30s',
    flags: ['a', 'w'],
    source: null,
  },
});
