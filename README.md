# my-blog

마크다운 파일을 읽어 렌더링하는 프레임워크 없는 정적 블로그.

## 로컬에서 실행하기

브라우저가 `.md` 파일을 `fetch`로 읽기 때문에, `index.html`을 더블클릭해서(`file://`) 열면 CORS 정책에 막혀 동작하지 않습니다. 아래처럼 간단한 정적 서버로 열어주세요.

```bash
npx serve .
```

또는

```bash
python -m http.server
```

이후 안내되는 주소(예: `http://localhost:3000` 또는 `http://localhost:8000`)로 접속합니다.

## 새 글 작성하기

1. `posts/` 폴더에 `YYYY-MM-DD-slug.md` 형식으로 마크다운 파일을 추가합니다. 파일 맨 위에 프론트매터를 작성합니다.

   ```
   ---
   title: 글 제목
   date: 2026-08-23
   ---
   본문...
   ```

2. `posts/index.json` 배열에 방금 만든 파일명을 추가합니다.
