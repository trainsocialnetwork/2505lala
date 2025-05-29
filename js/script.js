// Loading
window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    if (loading) { // 要素が存在するか確認
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }
});

// Mobile Menu
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');
const drawerClose = document.getElementById('drawer-close');

if (hamburger && drawer && drawerClose) { // 要素が存在するか確認
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        drawer.classList.toggle('active');
        document.body.classList.toggle('drawer-open'); // bodyにクラスを付与して背景固定などに対応
    });

    drawerClose.addEventListener('click', () => {
        hamburger.classList.remove('active');
        drawer.classList.remove('active');
        document.body.classList.remove('drawer-open');
    });

    // Drawer menu links click event
    const drawerLinks = drawer.querySelectorAll('a[href^="#"]');
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            drawer.classList.remove('active');
            document.body.classList.remove('drawer-open');
            // Smooth scrollは下の共通処理に任せる
        });
    });
}


// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // href="#" や href="" の場合は何もしない
        if (href === '#' || href === '') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20; // 20pxのオフセット

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close drawer if open (ハンバーガーメニューが開いていたら閉じる)
            if (hamburger && drawer && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                drawer.classList.remove('active');
                if (document.body.classList.contains('drawer-open')) {
                    document.body.classList.remove('drawer-open');
                }
            }
        }
    });
});

// Scroll Animation
const observerOptions = {
    threshold: 0.1, // 要素が10%見えたら発火
    rootMargin: '0px 0px -50px 0px' // 画面下部より50px手前で判定開始
};

const observer = new IntersectionObserver((entries, obs) => { // obsを引数に追加
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target); // 一度表示されたら監視を解除（パフォーマンス向上のため）
        }
    });
}, observerOptions);

document.querySelectorAll('.animate').forEach(el => {
    observer.observe(el);
});

// Header Shadow on Scroll
let lastScroll = 0;
const header = document.querySelector('.header');

if (header) { // header要素が存在するか確認
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) { // ページトップの場合
            header.classList.remove('header-scrolled');
            header.style.boxShadow = '0 1px 10px rgba(0, 0, 0, 0.05)'; // 初期スタイルに戻す
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('header-hidden')) {
            // Scroll Down - 必要であればヘッダーを隠す処理
            // header.classList.add('header-hidden');
        } else if (currentScroll < lastScroll && header.classList.contains('header-hidden')) {
            // Scroll Up - ヘッダーを再表示する処理
            // header.classList.remove('header-hidden');
        }

        if (currentScroll > 100) {
            header.classList.add('header-scrolled'); // スクロール状態を示すクラス
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.classList.remove('header-scrolled');
            header.style.boxShadow = '0 1px 10px rgba(0, 0, 0, 0.05)';
        }

        lastScroll = currentScroll;
    });
}
