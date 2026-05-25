/* ==========================================================================
   js/result.js-담당:마이티투짱 
   결과 로직, 프레임 선택 및 저장 
   ========================================================================== */

/**
 * 최종 포토 스트립 렌더링 (camera.js에서 자동 호출됨)
 */
function renderPhotoStrip() {
  console.log("🖼️ 포토 스트립 생성 시작...");

  // 앱 전역 상태에서 데이터 가져오기
  const photos = window.AppState.capturedImages;
  const currentFrame = window.AppState.selectedFrame;
  
  // 결과 화면의 컨테이너 찾기
  const resultWrapper = document.getElementById("result-view-wrapper");
  if (!resultWrapper) {
    console.error("❌ #result-view-wrapper 요소를 찾을 수 없습니다!");
    return;
  }

  // 기존 내용 초기화
  resultWrapper.innerHTML = "";

  // 1. 포토 스트립 구조 생성 (세로 형태)
  const photoStrip = document.createElement("div");
  photoStrip.id = "generated-photo-strip";
  
  // 선택된 프레임에 따른 스타일 적용
  // (추후 assets/frames의 PNG 이미지로 교체 예정)
  photoStrip.style.width = "100%";
  photoStrip.style.height = "100%";
  photoStrip.style.display = "flex";
  photoStrip.style.flexDirection = "column";
  photoStrip.style.alignItems = "center";
  photoStrip.style.gap = "15px";
  photoStrip.style.padding = "20px 15px 40px 15px";
  photoStrip.style.position = "relative";
  
  // 프레임 스타일 적용 (임시 테스트용)
  applyMockFrameStyle(photoStrip, currentFrame);

  // 2. 4장의 사진 추가 (위에서 아래로)
  photos.forEach((photoData, index) => {
    const photoCell = document.createElement("div");
    photoCell.className = "photo-cell";
    photoCell.style.width = "100%";
    photoCell.style.aspectRatio = "4 / 3"; // 기본 사진 비율
    photoCell.style.borderRadius = "4px";
    photoCell.style.backgroundColor = photoData; // camera.js에서 전달된 데이터
    
    // 각 사진 번호 표시
    photoCell.style.display = "flex";
    photoCell.style.justifyContent = "center";
    photoCell.style.alignItems = "center";
    photoCell.style.color = "#fff";
    photoCell.style.fontWeight = "bold";
    photoCell.innerHTML = `사진 ${index + 1}`;

    photoStrip.appendChild(photoCell);
  });

  // 3. 현재 날짜 추가 (마이티투짱 담당 기능)
  const dateElement = document.createElement("div");
  dateElement.className = "strip-date";
  dateElement.innerText = getFormattedDate();
  dateElement.style.position = "absolute";
  dateElement.style.bottom = "12px";
  dateElement.style.fontSize = "0.8rem";
  dateElement.style.fontWeight = "600";
  dateElement.style.letterSpacing = "1px";
  
  // 프레임에 따라 날짜 색상 변경
  dateElement.style.color = (currentFrame === "frame-2") ? "#333333" : "#ffffff";

  photoStrip.appendChild(dateElement);

  // 결과 화면에 추가
  resultWrapper.appendChild(photoStrip);
  console.log("🎉 포토 스트립 생성 완료!");
}

/**
 * 현재 날짜를 YYYY.MM.DD 형식으로 반환
 */
function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * 임시 프레임 스타일 적용 (PNG 이미지 전 단계)
 */
function applyMockFrameStyle(element, frameType) {
  switch (frameType) {
    case "frame-1":
      element.style.backgroundColor = "#1a1a1a";
      element.style.border = "2px solid #333";
      break;
    case "frame-2":
      element.style.backgroundColor = "#f5f5f5";
      element.style.border = "2px solid #ddd";
      break;
    case "frame-3":
      element.style.backgroundColor = "#ff758c";
      element.style.border = "2px solid #ff758c";
      break;
    case "frame-4":
      element.style.backgroundColor = "#4776e6";
      element.style.border = "2px solid #4776e6";
      break;
    default:
      element.style.backgroundColor = "#1a1a1a";
  }
}

/**
 * 포토 스트립 다운로드 (saveCanvas 대체 기능)
 */
function downloadPhotoStrip() {
  console.log("💾 포토 스트립 저장 시작...");
  
  alert(`🎉 저장 완료!\n프레임: ${window.AppState.selectedFrame}\n날짜: ${getFormattedDate()}`);
}