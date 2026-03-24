# React Tutorial Overlay Restart Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 라이브러리 런타임 안정성, 테스트 신뢰성, 문서 정합성, docs 품질 게이트를 복구해서 다시 기능 개선을 시작할 수 있는 기준선을 만든다.

**Architecture:** 작업은 서로 충돌을 줄이기 위해 독립 워크트리 단위로 나눈다. 먼저 라이브러리의 공개 API와 런타임 동작을 안정화하고, 그 다음 테스트와 docs 도구 체인을 복구한다. 마지막으로 README와 문서 사이트를 실제 구현과 맞춰 사용자-facing 진입점을 정리한다.

**Tech Stack:** pnpm workspace, React 18, TypeScript, tsup, Jest, Next.js 14, MDX, ESLint

---

## Status Snapshot

- 완료: `codex/restore-main-tests` 병합 완료
- 완료: `codex/fix-runtime-contract` 병합 완료
- 완료: `codex/fix-docs-lint` 병합 완료
- 완료: `codex/align-readme-and-docs` 병합 완료
- 완료: `codex/add-keyboard-and-close-controls` 병합 완료
- 반영된 내용:
  - `packages/main/test/setup.ts` 추가
  - `packages/main/jest.config.js` 정상화
  - `tutorial.open()` / `next()` / `close()` 최소 동작 테스트 추가
  - target element 미존재 시 overlay resilience 테스트 추가
  - `packages/main` 테스트 CI 추가
  - PR coverage comment 워크플로 추가
  - 루트 `pnpm build`가 통과하도록 `size-limit` 실행 순서 조정
  - `onPrevStep` / `onNextStep` 중복 실행 제거
  - 첫 step에서 `prev()` 호출 시 `onPrevStep`이 실행되지 않도록 보정
  - `content`를 `dangerouslySetInnerHTML` 없이 plain string으로 렌더링하도록 변경
  - `packages/main/test/store.test.tsx` 및 `packages/main/test/content.test.tsx` 추가
  - README 예제를 실제 공개 API와 맞게 수정
  - `packages/document`의 ESLint를 Next 14와 호환되는 ESLint 8 체계로 정렬
  - docs lint 경고/오류를 유발하던 실제 JSX key 및 Tailwind 클래스 위반 정리
  - `packages/document build` 전에 `packages/main` 산출물을 준비하도록 prebuild 추가
  - README, docs landing page, docs sidebar, MDX 예제를 현재 공개 API 기준으로 재정렬
  - 존재하지 않는 docs sidebar 링크 제거
  - 잘못된 GitHub 저장소 링크 수정
  - `Options.keyboardNavigation`, `Options.closeOnOverlayClick` 추가
  - overlay open 상태에서만 `Escape`, `ArrowLeft`, `ArrowRight` 단축키 처리 추가
  - `input` / `textarea` / `select` / `contenteditable` 포커스 중 단축키 무시 처리 추가
  - backdrop click close를 opt-in 동작으로 추가하고 highlight / info box 클릭과 구분
  - keyboard / overlay close 관련 README 및 docs 예제 업데이트
- 현재 기준선:
  - `pnpm -C packages/main test` 통과
  - `pnpm -C packages/main test:coverage` 통과
  - `pnpm -C packages/main build` 통과
  - `pnpm -C packages/document lint` 통과
  - `pnpm -C packages/document build` 통과
  - `pnpm build` 통과

---

## Recommended Worktree Order

1. `codex/restore-main-tests` (완료)
2. `codex/fix-runtime-contract` (완료)
3. `codex/fix-docs-lint` (완료)
4. `codex/align-readme-and-docs` (완료)

각 작업은 독립적으로 시작할 수 있지만, 실제 병합 순서는 위 순서를 권장했다.

## Restart Work Summary

재시동 계획에 포함된 4개 워크트리 기준 작업은 모두 완료되어 `main` 기준선에 반영됐다. 이 문서는 이제 “복구 작업 체크리스트” 역할은 끝났고, 다음 단계인 기능 확장 후보를 정리하는 참고 문서로 유지한다.

## Next Product Work Candidates

첫 기능 확장 작업으로 권장했던 `codex/add-keyboard-and-close-controls`는 완료 및 병합됐다.

다음으로 바로 붙이기 좋은 기능 후보는 아래 2개다.

1. `codex/add-highlight-padding-and-overlay-click-behavior`
2. `codex/add-promise-api`

이제 추천 시작점은 `codex/add-highlight-padding-and-overlay-click-behavior`다.

- `Options.highLightPadding`가 타입에는 있지만 실제 highlight 계산에는 반영되지 않는다.
- overlay 클릭 시 닫을지 여부, highlight 영역 바깥 상호작용을 어떻게 막을지 같은 핵심 UX 정책이 아직 없다.

그 다음 우선순위는 Promise API다.

- README에 예고만 있었고 아직 실제 API가 없다.
- `tutorial.open()`이 완료 시점을 resolve하는 Promise를 반환하면 튜토리얼 종료 후 후속 로직 연결이 쉬워진다.
- 다만 상태 계약을 한 번 더 설계해야 해서 앞의 두 작업보다 약간 무겁다.

## Common Setup For Every Worktree

Run:

```bash
git worktree add ../react-tutorial-overlay-<task-name> -b codex/<task-name>
cd ../react-tutorial-overlay-<task-name>
pnpm install
```

Expected:

- 워크트리가 현재 `main` 기준으로 생성된다.
- `pnpm install` 후 루트와 각 패키지 스크립트를 실행할 수 있다.

---

### Task 1: Fix Runtime Contract And Unsafe Rendering

**Suggested worktree:** `codex/fix-runtime-contract`

**Status:** 완료 및 병합됨

**Goal:** step 이동 콜백 중복 실행을 제거하고, `content` 렌더링 계약을 안전한 방향으로 정리한다.

**Files:**
- Modify: `packages/main/src/components/content.tsx`
- Modify: `packages/main/src/core/store.ts`
- Modify: `packages/main/src/core/types.ts`
- Modify: `packages/main/src/core/tutorial.ts`
- Modify: `packages/main/src/index.ts`
- Modify: `README.md`
- Test: `packages/main/test/store.test.ts`
- Test: `packages/main/test/content.test.tsx`

**Scope:**
- `onPrevStep` / `onNextStep`가 한 번만 실행되도록 정리
- 버튼 클릭 경로와 `tutorial.next()` / `tutorial.prev()` 직접 호출 경로의 동작 일관화
- `dangerouslySetInnerHTML` 제거 여부 결정
- 공개 API를 `string` 중심으로 유지할지, `ReactNode` 기반으로 변경할지 결정

**Acceptance criteria:**
- step 이동 한 번당 콜백이 정확히 한 번 실행된다.
- `Content`에서 raw HTML을 무검증으로 주입하지 않는다.
- README 예제가 실제 API와 일치한다.
- `pnpm -C packages/main test`에 관련 테스트가 포함된다.

**Result:**
- `Content` 버튼 경로가 `tutorial.prev()` / `tutorial.next()` / `tutorial.close()`를 사용하도록 정리돼 callback 실행 위치가 store로 일원화됨
- `content`는 plain string 계약으로 유지하고 HTML 문자열은 텍스트로만 렌더링하도록 변경
- `packages/main/test/store.test.tsx`에 next/prev callback invocation count 및 first-step prev no-op 테스트 추가
- `packages/main/test/content.test.tsx`에 버튼 경로 callback 단일 실행 및 HTML 문자열 비해석 렌더링 테스트 추가
- README 예제를 실제 공개 API와 맞게 수정하고 `content` 문자열 계약을 명시
- `pnpm -C packages/main test`, `pnpm build` 통과

---

### Task 2: Restore Main Package Test Infrastructure

**Suggested worktree:** `codex/restore-main-tests`

**Status:** 완료 및 병합됨

**Goal:** `packages/main` 테스트 러너를 실제 동작하는 상태로 복구하고 최소 회귀 테스트 기반을 만든다.

**Files:**
- Modify: `packages/main/jest.config.js`
- Create: `packages/main/test/setup.ts`
- Create: `packages/main/test/tutorial-overlay.test.tsx`
- Create: `packages/main/test/tutorial.test.tsx`
- Modify: `packages/main/package.json`
- Create: `.github/workflows/main-package-test.yml`
- Create: `.github/workflows/main-package-coverage-comment.yml`
- Modify: `package.json`

**Scope:**
- 누락된 Jest setup 파일 추가
- jsdom 환경에서 overlay 열기/닫기/step 이동 핵심 시나리오 테스트 추가
- 필요하면 테스트 유틸 작성

**Acceptance criteria:**
- `pnpm -C packages/main test`가 설정 에러 없이 실행된다.
- 최소한 아래 시나리오가 테스트된다.
- `tutorial.open()` 호출 시 overlay가 열린다.
- 마지막 step에서 `next()` 호출 시 닫힌다.
- target element를 찾지 못할 때 런타임이 깨지지 않는다.

**Result:**
- 위 acceptance criteria 충족
- `pnpm -C packages/main test:coverage` 스크립트 추가
- PR 테스트/coverage comment 워크플로 추가
- 루트 `pnpm build`가 `size-limit` 순서 문제 없이 통과하도록 보정

---

### Task 3: Fix Docs Lint Pipeline

**Suggested worktree:** `codex/fix-docs-lint`

**Status:** 완료 및 병합됨

**Goal:** docs 패키지의 lint 명령과 Next build의 lint 단계가 안정적으로 통과하도록 ESLint 구성을 현재 툴체인과 맞춘다.

**Files:**
- Modify: `packages/document/package.json`
- Modify or Replace: `packages/document/.eslintrc.json`
- Possible Create: `packages/document/eslint.config.mjs`
- Optional Modify: `packages/document/next.config.mjs`

**Scope:**
- `eslint@9` 유지 후 flat config로 마이그레이션하거나
- `next lint`와 호환되는 ESLint 버전으로 다운그레이드
- repo 유지보수 관점에서 더 단순한 쪽 선택

**Acceptance criteria:**
- `pnpm -C packages/document lint` 통과
- `pnpm -C packages/document build` 통과
- lint 설정이 현행 Next 버전과 충돌하지 않는다.

**Result:**
- `next lint`와 충돌하던 `eslint@9`를 `eslint@8`로 내려 Next 14 툴체인과 정렬
- `.eslintrc.json`에서 `next/babel` 확장을 제거하고 `next/core-web-vitals` 중심 구성을 유지
- `packages/document/package.json`에 `prebuild`를 추가해 새 워크트리에서도 docs build 전에 `packages/main` 산출물이 준비되도록 보정
- `packages/document/src/components/code.tsx`의 `jsx-key` 오류와 docs UI의 Tailwind 클래스 경고를 최소 범위로 정리
- `pnpm -C packages/document lint`, `pnpm -C packages/document build`, `pnpm build` 통과

---

### Task 4: Align README And Docs With Reality

**Suggested worktree:** `codex/align-readme-and-docs`

**Status:** 완료 및 병합됨

**Goal:** 현재 구현과 어긋난 README, dead link, 잘못된 GitHub 링크, 미완성 문서 네비게이션을 정리해서 외부 사용자가 헷갈리지 않게 만든다.

**Files:**
- Modify: `README.md`
- Modify: `packages/document/src/components/docs-layout.tsx`
- Modify: `packages/document/src/pages/index.tsx`
- Modify: `packages/document/src/pages/docs/index.mdx`
- Modify: `packages/document/src/pages/docs/tutorial.mdx`
- Modify: `packages/document/src/pages/docs/tutorial-overlay.mdx`
- Add: `docs/plans/2026-03-24-project-restart.md`

**Scope:**
- README의 잘못된 사용 예제 수정
- coming soon 항목 중 실제 미구현 내용 재정리
- docs 사이드바에서 없는 페이지 링크 제거 또는 placeholder 문서 생성
- GitHub 저장소 URL 오타 수정

**Acceptance criteria:**
- README만 봐도 현재 버전 사용법을 정확히 따라 할 수 있다.
- docs 네비게이션에 404 링크가 없다.
- landing page 예제가 실제 API와 맞다.

**Result:**
- README 소개 문구와 기능 목록을 현재 구현 범위에 맞게 축소
- README 예제를 `tutorial.open({ steps, options })` 시그니처와 plain string `content` 계약에 맞게 수정
- landing page 튜토리얼 데모 문구를 실제 공개 API 기준으로 정리
- docs sidebar에서 존재하지 않는 `Styling`, `Customizing`, `Version 1` 링크 제거
- docs header의 잘못된 GitHub 저장소 URL을 `sjsjsj1246/react-tutorial-overlay`로 수정
- `docs/index.mdx`, `tutorial.mdx`, `tutorial-overlay.mdx` 예제를 현재 공개 API와 맞게 최소 범위로 정리
- `pnpm -C packages/document lint`, `pnpm -C packages/document build` 통과

**Verification:**

Run:

```bash
pnpm -C packages/document lint
pnpm -C packages/document build
```

Expected:

- ESLint 경고/오류 없이 통과
- 정적 문서 페이지 생성 성공
- 문서 네비게이션에 명백한 dead link 없음

---

## Merge And Release Checklist

모든 워크트리 병합 후 메인 브랜치에서 실행:

```bash
pnpm -C packages/main test
pnpm -C packages/document lint
pnpm -C packages/document build
pnpm build
```

Expected:

- library test 통과
- docs lint 통과
- docs build 통과
- root build 통과

릴리즈 전 확인:

- `README.md` 예제 코드가 실제 공개 타입과 일치하는지 다시 확인
- `dist/` 산출물이 필요 이상으로 커밋되지 않는지 확인
- 변경 로그가 필요하면 `CHANGELOG.md` 또는 release note 초안 작성

---

## Suggested Next Feature Plan

첫 번째 후속 기능 작업으로 권장했던 `codex/add-keyboard-and-close-controls`는 완료 및 병합됐다. 이제 다음 추천 작업은 `codex/add-highlight-padding-and-overlay-click-behavior`다.

### Candidate A: Add Keyboard And Close Controls

**Suggested worktree:** `codex/add-keyboard-and-close-controls`

**Status:** 완료 및 병합됨

**Goal:** 키보드와 닫기 동작을 옵션화해서 기본 사용성과 접근성을 개선한다.

**Why this first:**
- 구현 난이도가 낮고 효과가 바로 보인다.
- 기존 store / overlay / test 구조를 그대로 활용할 수 있다.
- 문서화도 단순하다.

**Proposed scope:**
- `Escape`로 튜토리얼 닫기
- `ArrowRight`로 다음 step
- `ArrowLeft`로 이전 step
- 옵션으로 키보드 제어 활성화/비활성화
- 옵션으로 overlay click close 활성화/비활성화

**Files likely involved:**
- Modify: `packages/main/src/core/types.ts`
- Modify: `packages/main/src/components/tutorial-overlay.tsx`
- Modify: `packages/main/src/core/store.ts`
- Test: `packages/main/test/tutorial-overlay.test.tsx`
- Modify: `README.md`
- Modify: `packages/document/src/pages/docs/tutorial.mdx`
- Modify: `packages/document/src/pages/docs/tutorial-overlay.mdx`

**Acceptance criteria:**
- 옵션이 켜져 있을 때 `Escape`, `ArrowLeft`, `ArrowRight`가 기대대로 동작한다.
- 옵션이 꺼져 있으면 기존 버튼 기반 동작만 유지된다.
- overlay click close 동작이 옵션으로 제어된다.
- 관련 테스트와 문서가 추가된다.

**Result:**
- `Options`에 `keyboardNavigation`, `closeOnOverlayClick` 옵션 추가
- overlay가 열려 있을 때만 `Escape`, `ArrowLeft`, `ArrowRight` 전역 keydown 처리 추가
- 첫 step에서 `ArrowLeft`는 no-op이고, 마지막 step에서 `ArrowRight`는 기존 완료 동작을 유지
- `input` / `textarea` / `select` / `contenteditable` 포커스 중 단축키를 무시하도록 보정
- backdrop click close를 opt-in으로 추가하고 highlight / info box 클릭은 close와 분리
- `packages/main/test/tutorial-overlay.test.tsx`에 keyboard / backdrop click close 회귀 테스트 추가
- README 및 docs 예제를 새 옵션 계약과 맞게 업데이트
- `pnpm -C packages/main test`, `pnpm -C packages/document build`, `pnpm build` 통과

### Candidate B: Add Highlight Padding And Overlay Behavior

**Suggested worktree:** `codex/add-highlight-padding-and-overlay-click-behavior`

**Status:** 완료 및 병합됨

**Goal:** 이미 타입에 존재하는 `highLightPadding`를 실제 위치 계산에 반영하고 overlay UX를 다듬는다.

**Why this next:**
- 현재 옵션 타입과 실제 동작이 어긋나 있다.
- highlight 박스가 target element에 너무 딱 붙어 보이는 문제를 해결할 수 있다.

**Proposed scope:**
- `highLightPadding`를 rect 계산에 반영
- viewport 경계에서 info box 위치 보정
- 필요하면 highlight border radius와 padding 동기화

**Files likely involved:**
- Modify: `packages/main/src/core/types.ts`
- Modify: `packages/main/src/components/tutorial-overlay.tsx`
- Test: `packages/main/test/tutorial-overlay.test.tsx`
- Modify: `README.md`
- Modify: `packages/document/src/pages/docs/tutorial.mdx`
- Modify: `packages/document/src/pages/docs/tutorial-overlay.mdx`

**Acceptance criteria:**
- `highLightPadding`가 기본값과 사용자 지정 값 모두에서 highlight rect에 반영된다.
- info box가 viewport 가장자리 근처에서도 잘리지 않게 보정된다.
- padding 적용 후 highlight 시각 스타일과 info box 배치가 기존 UX를 크게 해치지 않는다.
- 관련 테스트와 문서가 현재 동작과 일치한다.

**Result:**
- `Options.highLightPadding` 기본값을 `8`로 두고 highlight rect 계산에 실제 반영
- highlight frame을 `box-sizing: border-box` 기준으로 정리하고 padding 크기에 맞춰 border radius를 동기화
- 첫 번째 유효 target 기준으로 info box anchor를 잡고 viewport 좌우/상하 경계 안으로 위치 보정
- `packages/main/test/tutorial-overlay.test.tsx`에 default/custom padding, viewport clamp 회귀 테스트 추가
- README 및 docs 예제를 `highLightPadding`과 info box 재배치 동작 설명에 맞게 업데이트
- `pnpm -C packages/main test`, `pnpm -F @react-tutorial-overlay/document build`, `pnpm build` 통과

### Candidate C: Add Promise API

**Suggested worktree:** `codex/add-promise-api`

**Status:** 다음 추천 작업

**Goal:** 튜토리얼 완료/취소 시점을 소비자가 await할 수 있도록 Promise 기반 API를 추가한다.

**Why later:**
- 가장 제품 가치가 크지만 상태 전이와 close reason 설계가 필요하다.
- `tutorial.open()` 반환형 변경과 문서화가 뒤따른다.

**Proposed scope:**
- `tutorial.open()`이 Promise를 반환
- 완료 / 건너뛰기 / 강제 종료를 구분하는 resolve payload 정의
- docs와 examples에 async usage 추가
