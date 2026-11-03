// ==========================================
// 1. 다크 모드 상태 관리 및 렌더링
// ==========================================
const themeToggleBtn = document.querySelector('.theme-toggle');

const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    }
};
initTheme();

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    }
    
    // 배경 캔버스 테마 색상 동기화
    if (window.updateBgCanvasTheme) {
        window.updateBgCanvasTheme();
    }
});

// ==========================================
// 2. 모바일 네비게이션 및 스크롤 이벤트
// ==========================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const header = document.getElementById('header');
const scrollTopBtn = document.getElementById('scroll-top');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
        }

        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (window.scrollY > 300) {
        scrollTopBtn.classList.remove('hidden');
    } else {
        scrollTopBtn.classList.add('hidden');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==========================================
// 3. 스크롤 애니메이션 (Intersection Observer API)
// ==========================================
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-in').forEach(section => {
    observer.observe(section);
});

// ==========================================
// 4. 인터랙티브 AI 신경망 파티클 캔버스 배경
// ==========================================
const initBackgroundCanvas = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0); // 기존 스케일 리셋
        ctx.scale(dpr, dpr);
        createParticles();
    };

    let isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // 테마별 색상 설정 (라이트 모드에서도 도트와 선이 확실하게 보이도록 가시성 강화)
    let particleColor = isDark ? 'rgba(96, 165, 250, ' : 'rgba(79, 70, 229, ';
    let lineColor = isDark ? 'rgba(147, 197, 253, ' : 'rgba(99, 102, 241, ';
    let maxLineDistance = 140;
    let maxMouseDistance = 170;

    window.updateBgCanvasTheme = () => {
        isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        particleColor = isDark ? 'rgba(96, 165, 250, ' : 'rgba(79, 70, 229, ';
        lineColor = isDark ? 'rgba(147, 197, 253, ' : 'rgba(99, 102, 241, ';
    };

    const mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // 화면 크기 반응형 파티클 수 계산
    const getParticleCount = () => {
        if (width < 600) return 32;
        if (width < 1024) return 48;
        return 70;
    };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2.2 + 1.2;
            this.baseAlpha = Math.random() * 0.45 + 0.4;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // 마우스 인터랙션: 커서 주변에서 부드럽게 반응
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxMouseDistance) {
                    const force = (maxMouseDistance - dist) / maxMouseDistance;
                    this.x += (dx / dist) * force * 1.1;
                    this.y += (dy / dist) * force * 1.1;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${particleColor}${this.baseAlpha})`;
            ctx.fill();
        }
    }

    let particles = [];
    const createParticles = () => {
        particles = [];
        const count = getParticleCount();
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    };

    resize();
    window.addEventListener('resize', resize);

    // 고성능 애니메이션 루프
    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        // 파티클 간 연결선 그리기
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxLineDistance) {
                    const alpha = (1 - dist / maxLineDistance) * (isDark ? 0.38 : 0.28);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `${lineColor}${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // 마우스/터치와 파티클 간 연결선
            if (mouse.x !== null && mouse.y !== null) {
                const mdx = mouse.x - particles[i].x;
                const mdy = mouse.y - particles[i].y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < maxMouseDistance) {
                    const malpha = (1 - mdist / maxMouseDistance) * (isDark ? 0.55 : 0.4);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `${lineColor}${malpha})`;
                    ctx.lineWidth = 1.3;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    };

    animate();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundCanvas);
} else {
    initBackgroundCanvas();
}

// ==========================================
// 5. Codyssey GitHub 저장소 연동
// ==========================================
const codysseyContainer = document.getElementById('codyssey-container');
const GITHUB_USERNAME = 'star-candy';

// 각 저장소의 코드와 문서를 확인해 작성한 프로젝트별 소개
const CODYSSEY_DESCRIPTIONS = {
    'b1-1_script_codyssey': 'Ubuntu 환경에서 SSH·방화벽·사용자 권한을 설정하고, 서비스 상태와 시스템 자원을 주기적으로 점검하는 보안·모니터링 실습입니다.',
    'b1-2_script_codyssey': '프로세스의 CPU·메모리 사용량을 수집하고, 메모리 부족·교착 상태·CPU 과점유 장애를 분석하는 Linux 트러블슈팅 프로젝트입니다.',
    'b2-1_household_codyssey': '수입·지출 기록, 거래 검색, 월별 예산과 통계, CSV 입출력을 지원하는 Python 명령줄 가계부입니다.',
    'b3-1_mini_redis_codyssey': '해시맵·이중 연결 리스트·최소 힙을 직접 구현해 키·값 저장, 만료 시간(TTL), LRU 기반 메모리 관리를 제공하는 Redis 모사 프로그램입니다.',
    'b3-2_mini_git_codyssey': '커밋과 브랜치를 그래프로 관리하고, 커밋 이력·조상·최단 경로·키워드를 탐색하며 Git의 핵심 자료구조를 학습하는 Python 프로그램입니다.',
    'b4-1_portfolio_codyssey': '개발 경험과 프로젝트를 소개하는 반응형 포트폴리오 웹사이트로, 다크 모드와 GitHub 저장소 자동 조회 기능을 제공합니다.',
    'b5-1_database_codyssey': '회원·도서·분류·대출 기록으로 구성된 SQLite 데이터베이스를 설계하고, SQL로 데이터 조작과 대출 통계를 실습하는 프로젝트입니다.',
    'b5-2_crud_codyssey': '현재 코드와 문서가 등록되지 않은 빈 저장소로, 구현 내용은 아직 확인할 수 없습니다.',
    'b6-1_aws_codyssey': 'AWS의 IAM·VPC·서브넷·보안 그룹·EC2를 구성하고, Nginx 웹 서버 배포와 접속 검증 과정을 기록한 클라우드 인프라 실습입니다.',
    'b6-2_ai_git_codyssey': 'Git 변경 내용을 Gemini API로 분석해 커밋 메시지와 PR 제목·본문 초안을 생성하는 Python 명령줄 도구입니다.',
    'b7-1_project_codyssey': 'Next.js·FastAPI·SQLite로 구현한 Gemini 기반 웹 챗봇으로, 회원 인증, 최근 대화 맥락을 반영한 응답, 대화 기록 저장·조회를 지원합니다.',
    'codyssey_git_workflow': '3인 팀이 GitHub Flow를 적용해 이슈·브랜치·PR·코드 리뷰와 병합 충돌 해결을 실습하고, amend·stash·reset·revert 사용 과정을 문서화한 협업 프로젝트입니다.'
};

// 개인 계정의 저장소 목록에 포함되지 않는 팀 프로젝트
const CODYSSEY_TEAM_PROJECTS = [{
    name: 'codyssey_git_workflow',
    full_name: 'codyssey-git-workflow/codyssey_git_workflow',
    html_url: 'https://github.com/codyssey-git-workflow/codyssey_git_workflow',
    language: null,
    description: CODYSSEY_DESCRIPTIONS.codyssey_git_workflow
}];

const getProjectDescription = (repoName, description) =>
    CODYSSEY_DESCRIPTIONS[repoName.toLowerCase()] || description ||
    '프로젝트 소개를 준비 중입니다. 저장소에서 코드와 문서를 확인할 수 있습니다.';

const fetchCodysseyProjects = async () => {
    if (!codysseyContainer) return;

    codysseyContainer.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">코디세이 프로젝트를 불러오는 중입니다...</p>';

    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=pushed&direction=desc&per_page=100`
        );

        if (!response.ok) {
            if (response.status === 403) throw new Error('API 호출 제한(Rate Limit)을 초과했습니다.');
            throw new Error('데이터를 불러오지 못했습니다.');
        }

        const personalRepos = await response.json();
        const repos = [...personalRepos];
        for (const teamRepo of CODYSSEY_TEAM_PROJECTS) {
            if (!repos.some(repo => repo.full_name?.toLowerCase() === teamRepo.full_name.toLowerCase())) {
                repos.push(teamRepo);
            }
        }

        // 저장소 이름이나 설명에 'codyssey'가 포함된 항목만 필터링
        const codysseyRepos = repos.filter(repo =>
            repo.name.toLowerCase().includes('codyssey') ||
            (repo.description && repo.description.toLowerCase().includes('codyssey'))
        );

        if (codysseyRepos.length === 0) {
            codysseyContainer.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">표시할 코디세이 프로젝트가 없습니다.</p>';
            return;
        }

        const html = codysseyRepos
            .sort((a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0))
            .map(repo => {
                const { name, html_url, description, language } = repo;
                const displayDesc = getProjectDescription(name, description);
                return `
                    <article class="card">
                        <h3><a href="${html_url}" target="_blank" rel="noopener noreferrer">${name}</a></h3>
                        <p style="margin: 0.5rem 0; color: var(--secondary-color);">${displayDesc}</p>
                        <span style="font-size: 0.85rem; font-weight: bold;">${language ? `🔵 ${language}` : '📁 Repository'}</span>
                    </article>
                `;
            }).join('');

        codysseyContainer.innerHTML = html;

    } catch (error) {
        codysseyContainer.innerHTML = `
            <div style="text-align:center; grid-column: 1/-1;">
                <p style="color: var(--error-color); margin-bottom: 1rem;">${error.message}</p>
                <button id="retry-btn" class="btn btn-secondary">다시 시도</button>
            </div>
        `;
        document.getElementById('retry-btn').addEventListener('click', fetchCodysseyProjects);
    }
};

fetchCodysseyProjects();
