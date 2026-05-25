# 📸 4-Cut Web Photo Booth with AR Filters

본 프로젝트는 p5.js 기반의 실시간 AR 필터 기능과 4장 연속 촬영 시스템을 탑재한 웹사이트입니다. 촬영 후 사용자가 직접 포토 스트립을 커스텀하고 저장할 수 있으며, PC 및 모바일 환경에 최적화된 반응형 웹 디자인으로 구현되었습니다.

---

## 👥 팀원 소개 및 역할 분담 (Team & Roles)


| 이름 (Name) | 담당 역할 (Main Role) | 상세 구현 내용 (Details) |
| :--- | :--- | :--- |
| **틀레우바이 아야у름** | 기획 & 디자인 & 코딩 | 전체 화면 흐름 제어 및 UI 스타일링(`style.css`, `main.js`), 카메라 촬영 시퀀스, 3-2-1 카운트다운 및 플래시 효과 구현(`camera.js`) |
| **응웬 바오 담** | AR 필터 구현 & 디자인 | MediaPipe Face Mesh 기반 실시간 얼굴 인식 동기화, 고양이/토끼/안경/왕관 AR 마스크 그래픽 렌더링 및 실시간 파티클(Confetti) 시스템 최적화(`ar-filter.js`) |
| **마이 티 투 짜نگ** | 결과 화면 구현 & 디자인 | 4장 사진 세로 스트립 레이아웃 합성, 4종 커스텀 프레임 디자인 및 실시간 적용 테마 시스템, 현재 날짜 표시 및 최종 이미지 파일 저장 기능(`result.js`) |

---

## 📂 폴더 구조 (Project Structure)

```text
my-photo-booth/
│
├── index.html          # 메인 HTML (화면 구조 및 스크립트 연결)
├── style.css           # 전체 앱 반응형 웹/모바일 UI 스타일시트
│
├── js/                 # 자바스크립트 기능 로직 폴더
│   ├── main.js         # 글로벌 앱 상태 제어 및 화면 전환 로직
│   ├── camera.js       # 카운트다운, 플래시, 4분할 컷 사진 캡처
│   ├── ar-filter.js    # 얼굴 인식, AR 필터 이미지 드로잉, 파티클 시스템
│   └── result.js       # 포토 스트립 캔버스 레이아웃 빌드, 프레임 변경, 파일 다운로드
│
└── assets/             # 그래픽 에셋 폴더
    ├── filters/        # AR 마스크 이미지 소스 (.png)
    └── frames/         # 인생네컷 전용 백그라운드 프레임 배경 소스 (.png)
```

---

## 🛠️ 주요 기술 스택 (Tech Stack)
- **Frontend**: HTML5, CSS3 (Flexbox, Media Queries), JavaScript (ES6)
- **Libraries**: p5.js (그래픽 렌더링 및 캔버스 제어), Face Mesh (실시간 안면 인식)
- **Deployment**: GitHub Pages (웹 서비스 실시간 배포)
