with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''            <!-- Day 2 -->
            <article class="card">
              <h3>Day 2 결과물 자리</h3>
              <div
                class="hub-content"
                style="margin-top: 1rem; line-height: 1.8"
              >
                <p><strong>문제:</strong></p>
                <p><strong>내가 한 일:</strong></p>
                <p><strong>사용 기술:</strong></p>
                <p><strong>결과:</strong></p>
              </div>
            </article>'''

replacement = '''            <!-- Day 2 -->
            <article class="card">
              <h3>Day 2 - 트론 체이싱 3D (Tron Chasing)</h3>
              <div
                class="hub-content"
                style="margin-top: 1rem; line-height: 1.8"
              >
                <p>
                  <strong>문제:</strong> 영화 '트론(TRON)' 스타일의 네온 사이버펑크 세계관을 바탕으로, 웹 브라우저 환경에서 실시간 3D 자동차 체이싱 및 라이트 트레일 서바이벌 게임 제작 과제
                </p>
                <p>
                  <strong>내가 한 일:</strong> AI Studio 환경에서 프롬프트 작성 및 지속적인 개선을 거쳐 3D 차량 충돌 물리, 플레이어 꼬리 궤적으로 적 AI 및 보스를 유도 파괴하는 게임 메커니즘, 부스터 가속 및 3종 다이내믹 카메라 시점을 구축하고 웹 배포
                </p>
                <p>
                  <strong>사용 기술:</strong> React, Three.js (WebGL), JavaScript, Web Audio API, Tailwind CSS, Google AI Studio
                </p>
                <p>
                  <strong>결과:</strong>
                  <a
                    href="https://tron-chasing.ai.studio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="color: var(--primary-color); text-decoration: underline; font-weight: 600;"
                    >트론 체이싱 3D 플레이하기 (tron-chasing.ai.studio) ↗</a
                  >
                </p>
              </div>
            </article>'''

if target in content:
    content = content.replace(target, replacement, 1)
    print('Replaced exact match (LF)')
else:
    target_crlf = target.replace('\n', '\r\n')
    replacement_crlf = replacement.replace('\n', '\r\n')
    if target_crlf in content:
        content = content.replace(target_crlf, replacement_crlf, 1)
        print('Replaced exact match (CRLF)')
    else:
        print('Target not found')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

