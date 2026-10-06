#!/usr/bin/env python3
"""Локальный сервер мастер-класса «Охота на баги».

Раздаёт сайт на этом компьютере и записывает статистику обоих уровней
в stats/statistics.csv: участник, уровень, какой баг найден и через сколько
времени от старта. Интернет не нужен.

    python3 server.py
"""
import argparse
import csv
import json
import threading
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
STATS_FILE = ROOT / 'stats' / 'statistics.csv'
FIELDS = ['at', 'name', 'level', 'event', 'bug', 'severity', 'points', 'clock', 'elapsed', 'score', 'session']
HEADER = ['Дата и время', 'Участник', 'Уровень', 'Событие', 'Баг', 'Серьёзность', 'Баллы',
          'Время от старта', 'Секунд от старта', 'Счёт', 'Сессия']
TEXT_FIELDS = ('name', 'bug')
MAX_BODY = 4096
LOCK = threading.Lock()


def text(value, limit=80):
    s = ' '.join(str(value or '').split())[:limit]
    return "'" + s if s[:1] in ('=', '+', '-', '@') else s  # Excel не исполнит формулу


def integer(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return 0


def append_row(data):
    elapsed = max(0, integer(data.get('elapsed')))
    row = [
        text(data.get('at'), 19),
        text(data.get('name'), 40),
        integer(data.get('level')),
        text(data.get('event'), 30),
        text(data.get('bug')),
        text(data.get('severity'), 30),
        integer(data.get('points')),
        f'{elapsed // 60:02d}:{elapsed % 60:02d}',
        elapsed,
        integer(data.get('score')),
        text(data.get('session'), 16),
    ]
    with LOCK:
        STATS_FILE.parent.mkdir(exist_ok=True)
        is_new = not STATS_FILE.exists()
        # utf-8-sig и «;» — чтобы файл сразу правильно открылся в Excel
        with STATS_FILE.open('a', encoding='utf-8-sig' if is_new else 'utf-8', newline='') as f:
            writer = csv.writer(f, delimiter=';')
            if is_new:
                writer.writerow(HEADER)
            writer.writerow(row)


def read_rows():
    if not STATS_FILE.exists():
        return []
    with LOCK, STATS_FILE.open(encoding='utf-8-sig', newline='') as f:
        rows = list(csv.reader(f, delimiter=';'))[1:]
    result = []
    for r in rows:
        item = dict(zip(FIELDS, r))
        for key in TEXT_FIELDS:
            if item.get(key, '').startswith("'"):
                item[key] = item[key][1:]
        result.append(item)
    return result


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')  # правки в файлах видны сразу
        super().end_headers()

    def send_json(self, payload, status=HTTPStatus.OK):
        body = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split('?', 1)[0]
        if path == '/api/ping':
            return self.send_json({'ok': True})
        if path == '/api/stats':
            return self.send_json(read_rows())
        return super().do_GET()

    def do_POST(self):
        if self.path.split('?', 1)[0] != '/api/stats':
            return self.send_json({'error': 'not found'}, HTTPStatus.NOT_FOUND)
        length = integer(self.headers.get('Content-Length'))
        if not 0 < length <= MAX_BODY:
            return self.send_json({'error': 'bad size'}, HTTPStatus.BAD_REQUEST)
        try:
            data = json.loads(self.rfile.read(length).decode('utf-8'))
            if not isinstance(data, dict):
                raise ValueError
        except ValueError:
            return self.send_json({'error': 'bad json'}, HTTPStatus.BAD_REQUEST)
        append_row(data)
        return self.send_json({'ok': True})

    def log_message(self, fmt, *args):
        pass  # не засоряем терминал запросами


def main():
    parser = argparse.ArgumentParser(description='Сервер мастер-класса «Охота на баги»')
    parser.add_argument('--port', type=int, default=5173)
    args = parser.parse_args()

    server = ThreadingHTTPServer(('127.0.0.1', args.port), Handler)
    print(f'Охота на баги: откройте в браузере http://localhost:{args.port}')
    print(f'Статистика пишется в {STATS_FILE}')
    print('Остановить: Ctrl+C')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
