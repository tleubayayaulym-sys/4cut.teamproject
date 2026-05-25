# 📸 4-Cut Web Photo Booth with AR Filters

MediaPipe와 p5.js를 활용하여 실시간 AR 필터를 적용하고, 4장 연속 촬영 후 나만의 인생네컷 포토 스트립을 커스텀하여 저장할 수 있는 웹 애플리케이션 프로젝트입니다. PC와 모바일 환경을 모두 지원하는 반응형 웹 디자인으로 제작되었습니다.

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
- **Libraries**: p5.js (그래픽 렌더링 및 캔버스 제어), MediaPipe Face Mesh (실시간 안면 인식)
- **Deployment**: GitHub Pages (웹 서비스 실시간 배포)

---

## 🚀 실행 방법 및 주의사항
1. 본 레포지토리의 코드는 실시간 반응형으로 구성되어 있어 모바일 화면과 PC 화면을 모두 완벽하게 지원합니다.
2. 현재 업로드된 코드는 시스템의 UI 흐름 테스트를 위한 **임시 목업(Mock-up) 상태**입니다. 각 담당자는 본인이 맡은 자바스크립트 파일(`js/`) 내부의 기능을 순차적으로 실제 라이브러리와 연동하여 고도화할 예정입니다.
