document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    initFixedNav();
    setInterval(updateTime, 1000);
    updateSlideshow();
    startAutoPlay();
    initNewsAnimations();
    InitObserverNotification();
    initFaculty();
    BackTop();
    initCampusGallery();

});
//警告
function Tip(){
    window.alert('还没写完')
}
//更新时间
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');

    // 格式化时间
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // 更新时间显示
    timeElement.textContent = `当前时间为: ${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
}

// 初始化固定导航栏功能
function initFixedNav() {
    createFixedNav();
    initScrollObserver();
}

function createFixedNav() {
    // 移除已存在的固定导航栏
    const existingNav = document.querySelector('.fixed-nav');
    if (existingNav) {
        existingNav.remove();
    }

    // 克隆原始导航栏
    const originalNav = document.querySelector('.header-bottom');
    if (!originalNav) return;

    // 创建固定导航栏容器
    const fixedNav = document.createElement('div');
    fixedNav.className = 'fixed-nav';

    // 克隆导航内容
    const navContent = originalNav.cloneNode(true);
    fixedNav.appendChild(navContent);

    // 添加到body
    document.body.appendChild(fixedNav);

    // 初始化下拉菜单事件
    initDropdownEvents(fixedNav);
}

function initScrollObserver() {
    const options = {
        threshold: 0,
        rootMargin: '-150px 0px 0px 0px'
    };

    const callback = (entries) => {
        const fixedNav = document.querySelector('.fixed-nav');
        if (!fixedNav) return;

        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                fixedNav.classList.add('visible');
            } else {
                fixedNav.classList.remove('visible');
            }
        });
    };

    const observer = new IntersectionObserver(callback, options);
    const target = document.querySelector('#page1');

    if (target) {
        observer.observe(target);
    }
}

function initDropdownEvents(fixedNav) {
    const menuItems = fixedNav.querySelectorAll('.nav > ul > li');

    menuItems.forEach(item => {
        const dropdown = item.querySelector('.dropdown');
        if (!dropdown) return;

        // 移除可能已存在的内联样式
        dropdown.removeAttribute('style');

        // 使用 mouseenter 和 mouseleave 来控制子菜单
        item.addEventListener('mouseenter', () => {
            // 清除所有其他打开的子菜单
            menuItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherDropdown = otherItem.querySelector('.dropdown');
                    if (otherDropdown) {
                        otherDropdown.classList.remove('active');
                    }
                }
            });

            // 显示当前子菜单
            dropdown.classList.add('active');
        });

        item.addEventListener('mouseleave', () => {
            // 添加一个小延迟，以防止菜单闪烁
            setTimeout(() => {
                if (!item.matches(':hover')) {
                    dropdown.classList.remove('active');
                }
            }, 100);
        });

        // 阻止子菜单中的点击事件冒泡
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}


// 头部轮播图功能
const slideshow = document.querySelector('.header-slideshow');
const slideImg = document.querySelector('.header-slideshow .slideImg');
const slides = document.querySelectorAll('.header-slideshow .slideImg li');
const indicators = document.querySelectorAll('.slider-indicators .indicator');
const prevBtn = document.querySelector('.slider-buttons button:first-child');
const nextBtn = document.querySelector('.slider-buttons button:last-child');
const campusVideo = document.getElementById('campus-video');

let currentIndex = 0;
const totalSlides = slides.length;
let autoPlayTimer;
// 轮播图相关函数
slideImg.style.transition = 'transform 1s ease-in-out';

function updateSlideshow() {
    slideImg.style.transform = `translateX(-${currentIndex * 25}%)`;
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);

    });
    //视频中断就重置
    if (campusVideo) {
        if (currentIndex === totalSlides - 1) {
            // 切换到视频时
            campusVideo.currentTime = 0;  // 重置进度
        } else {
            // 切换到其他轮播项时
            campusVideo.pause();
            campusVideo.currentTime = 0;  // 重置进度
        }
    }
    // 处理视频播放/暂停
    if (currentIndex === totalSlides - 1) {
        // 当切换到视频轮播项时
        campusVideo.play();
    } else {
        // 当切换到其他轮播项时
        campusVideo.pause();
    }
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlideshow();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlideshow();
}

function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
        if (currentIndex === totalSlides - 1 && !campusVideo.ended && !campusVideo.paused) {
            return;
        }
        nextSlide();
    }, 3000);
}

// 视频结束时自动播放下一张
campusVideo.addEventListener('ended', () => {
    nextSlide();
});

// 当视频被用户暂停时，恢复自动轮播
campusVideo.addEventListener('pause', () => {
    startAutoPlay();
});
function stopAutoPlay() {
    if(autoPlayTimer) {
        clearInterval(autoPlayTimer);
    }
}

// 轮播图事件绑定
let isTransitioning = false;

//指示器手动切换
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        if (!isTransitioning) {
            isTransitioning = true;
            stopAutoPlay();
            currentIndex = index;
            updateSlideshow();
            setTimeout(() => {
                isTransitioning = false;
            }, 1000);
            startAutoPlay();
        }
    });
})

prevBtn.addEventListener('click', () => {
    if(!isTransitioning) {
        isTransitioning = true;
        stopAutoPlay();
        prevSlide();
        setTimeout(() => {
            isTransitioning = false;
        }, 1000);
        startAutoPlay();
    }
});

nextBtn.addEventListener('click', () => {
    if(!isTransitioning) {
        isTransitioning = true;
        stopAutoPlay();
        nextSlide();
        setTimeout(() => {
            isTransitioning = false;
        }, 1000);
        startAutoPlay();
    }
});
// 新闻过滤功能
const categories = document.querySelectorAll('.title-categories .category');
const newsCards = document.querySelectorAll('.news-card');
let currentCategory = 'all';

function initNewsAnimations() {
    const observerNewsOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerNews = new IntersectionObserver((entries) => {
        // 找到所有新闻卡片c
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const leftCards = entry.target.querySelectorAll('.news-left .news-card');
                const rightCards = entry.target.querySelectorAll('.news-right .news-card');
                // 为左侧卡片添加动画
                leftCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = 'slideInLeft 1s forwards';
                        card.style.opacity = '1';
                    }, index * 200);
                });

                // 为右侧卡片添加动画
                rightCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = 'fadeInUp 1s forwards';
                        card.style.opacity = '1';
                    }, (leftCards.length + index) * 200);
                });
                filterNews('all');
                // 一旦触发动画就停止观察
                observerNews.unobserve(entry.target);
                /*                    if (!entry.isIntersecting){

                                    }*/
            }
        });
    }, observerNewsOptions);

    // 观察新闻部分
    const newsSection = document.querySelector('#page2');
    if (newsSection) {
        observerNews.observe(newsSection);
    }
}

function filterNews(category) {
    // 处理右侧新闻列表
    const rightNewsCards = document.querySelectorAll('.news-right .news-card');
    let visibleCount = 0;

    rightNewsCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        card.style.animation = 'none';
        card.offsetHeight; // 触发重排

        if (category === 'all') {
            if (visibleCount < 3) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 1s ease forwards';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        } else if (cardCategory === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 1s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });

    // 处理左侧焦点新闻
    const featuredNews = document.querySelectorAll('.news-left .news-card');
    featuredNews.forEach(featured => {
        const featuredCategory = featured.getAttribute('data-category');
        featured.style.animation = 'none';
        featured.offsetHeight; // 触发重排

        if (category === 'all') {
            if (featuredCategory === 'notice') {
                featured.style.display = 'block';
                featured.style.animation = 'slideInLeft 1s ease forwards';
            } else {
                featured.style.display = 'none';
            }
        } else if (featuredCategory === category) {
            featured.style.display = 'block';
            featured.style.animation = 'slideInLeft 1s ease forwards';
        } else {
            featured.style.display = 'none';
        }
    });
}


// 为分类添加点击事件
categories.forEach(category => {
    category.addEventListener('click', function() {
        categories.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.getAttribute('data-category');
        filterNews(currentCategory);
    });
});

// 新闻卡片悬停效果
newsCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        if (this.classList.contains('featured')) {
            const overlay = this.querySelector('.news-image-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
            }
        }
    });

    card.addEventListener('mouseleave', function() {
        if (this.classList.contains('featured')) {
            const overlay = this.querySelector('.news-image-overlay');
            if (overlay) {
                overlay.style.opacity = '0.8';
            }
        }
    });
});


// 通知公告观察
function InitObserverNotification() {
    // 创建一个标志，用于跟踪动画是否已经触发
    let animationTriggered = false;

    const ObserverNotificationOptions = {
        root: null,
        rootMargin: '0px',  // 可以调整这个值来改变触发的位置
        threshold: 0.2      // 当元素有10%进入视口时触发
    };

    const ObserverNotification = new IntersectionObserver((entries) => {
        entries.forEach(entry  => {
            // 只在元素进入视口且动画尚未触发时执行
            if (entry.isIntersecting && !animationTriggered) {
                animationTriggered = true; // 标记动画已触发

                const notificationCards = document.querySelectorAll('.notification-card');
                const activeFilterBtn = document.querySelector('.filter-tabs .filter-btn.active');
                const filterValue = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

                // 确保所有卡片初始状态是隐藏的
                notificationCards.forEach(card => {
                    card.style.opacity = '0';
                    card.style.display = 'none';
                });

                // 使用 requestAnimationFrame 来确保动画流畅
                requestAnimationFrame(() => {
                    let visibleCount = 0;

                    notificationCards.forEach((card, index) => {
                        const category = card.getAttribute('data-category');

                        if (filterValue === 'all') {
                            if (visibleCount < 6) {
                                showCard(card, index);
                                visibleCount++;
                            }
                        } else if (category === filterValue) {
                            showCard(card, index);
                        }
                    });

                    // 初始化通知功能
                    initNotification();
                });

                // 停止观察
                ObserverNotification.unobserve(entry.target);
            }
        });
    }, ObserverNotificationOptions);

    // 显示卡片的函数
    function showCard(card, index) {
        card.style.display = 'block';
        // 使用 setTimeout 创建级联动画效果
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.5s ease forwards`;
            card.style.opacity = '1';
        }, index * 100); // 每张卡片延迟 100ms
    }

    // 观察通知公告部分
    const NotificationSection = document.querySelector('#page3');
    if (NotificationSection) {
        ObserverNotification.observe(NotificationSection);
    }
}

// 通知公告功能
function initNotification() {
    const filterBtns = document.querySelectorAll('.filter-tabs .filter-btn');
    const notificationCards = document.querySelectorAll('.notification-card');
    let isAnimating = false; // 防止动画重叠

    function filterCards(filterValue) {
        if (isAnimating) return;
        isAnimating = true;

        // 获取当前可见的卡片
        const visibleCards = Array.from(notificationCards).filter(card =>
            window.getComputedStyle(card).display !== 'none'
        );

        // 首先淡出当前可见的卡片
        const fadeOutPromises = visibleCards.map(card => {
            return new Promise(resolve => {
                card.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                    resolve();
                }, 300);
            });
        });

        // 等待所有卡片淡出完成后，再显示新的卡片
        Promise.all(fadeOutPromises).then(() => {
            let visibleCount = 0;
            const cardsToShow = [];

            // 确定哪些卡片需要显示
            notificationCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all') {
                    if (visibleCount < 6) {
                        cardsToShow.push(card);
                        visibleCount++;
                    }
                } else if (category === filterValue) {
                    cardsToShow.push(card);
                }
            });

            // 设置所有要显示的卡片的初始状态
            cardsToShow.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.animation = 'none';
            });

            // 强制重排以确保动画正确触发
            void cardsToShow[0]?.offsetHeight;

            // 依次触发每个卡片的动画
            cardsToShow.forEach((card, index) => {
                setTimeout(() => {
                    card.style.animation = `fadeInUp 0.5s ease forwards`;
                }, index * 100);
            });

            // 更新加载更多按钮状态
            updateLoadMoreButton(filterValue, notificationCards.length);

            // 确保所有动画完成后才重置动画状态
            setTimeout(() => {
                isAnimating = false;
            }, cardsToShow.length * 100 + 500);
        });
    }

    function showFilteredCard(card, index) {
        card.style.display = 'block';
        card.style.opacity = '0';

        setTimeout(() => {
            card.style.animation = `fadeInUp 0.5s ease forwards`;
            card.style.opacity = '1';
        }, index * 100);
    }

    function updateLoadMoreButton(filterValue, totalCards) {
        const loadMoreBtn = document.querySelector('.load-more');
        if (loadMoreBtn) {
            if (filterValue === 'all' && totalCards > 6) {
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    // 绑定筛选按钮点击事件
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (isAnimating) return; // 如果正在动画中，忽略点击

            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filterValue = this.getAttribute('data-filter');
            filterCards(filterValue);
        });
    });

    // 绑定加载更多按钮事件
    const loadMoreBtn = document.querySelector('.load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            if (isAnimating) return;

            const hiddenCards = Array.from(notificationCards).filter(
                card => card.style.display === 'none'
            );

            hiddenCards.slice(0, 6).forEach((card, index) => {
                showFilteredCard(card, index);
            });

            if (hiddenCards.length <= 6) {
                this.style.display = 'none';
            }
        });
    }
}

//师资力量功能
function initFaculty() {
    const facultyContent = document.querySelector('.faculty-content');
    const facultyTeamTxt = document.querySelector('.faculty-team-txt');
    const facultyImage = document.querySelector('.faculty-image-wrapper img');
    const facultyDots = document.querySelectorAll('.faculty-section .page-dot');
    const facultyPrevBtn = document.querySelector('.faculty-nav .prev');
    const facultyNextBtn = document.querySelector('.faculty-nav .next');

    // 如果关键元素不存在，就不初始化
    if (!facultyContent || !facultyTeamTxt || !facultyImage) {
        return false;
    }

    // 教师数据
    const facultyData = [
        {
            name: '秦瑞峰',
            title: '副教授 | 硕士研究生 | 计算机系主任',
            description: '主要从事计算机网络技术，应用技术和人工智能技术应用相关课程，先后发表论文7篇，编写著作2部。曾获取过《高级职业指导师》的职业证书',
            details: {
                research: '信息安全，网络技术应用',
                courses: '计算机导论，Java，网页设计'
            },
            image: './images/t.jpeg'
        },
        {
            name: '王建君',
            title: '副教授 | 硕士研究生',
            description: '主要从事现代教育技术类教学的课程，先后发表论文8篇，曾获取家庭教育咨询师证书（高级），金山办公软件技能认证的KOS大师证书。',
            details: {
                research: '现代教育技术',
                courses: 'C语言程序设计，Java，数据库基础'
            },
            image: './images/wjj.png'
        },
        {
            name: '赵新平',
            title: '讲师 | 硕士研究生',
            description: '主要从事专业课教学,曾任某企业信息部主管，负责公司园区数据网络和监控系统的维护，主持了公司ERP项目的调研、实施和数据中心的建设\n项目经验丰富，实践能力突出。',
            details: {
                research: '什么都研究',
                courses: 'C语言程序设计，计算机组装与维护，计算机辅助教学，微机原理等等多门专业课'
            },
            image: './images/t.jpeg'
        }
    ];

    let currentFacultyIndex = 0;
    let facultyAutoPlayTimer;
    let isFacultyTransitioning = false;
    let isExpanded = false;

    function updateFacultyDisplay() {
        const faculty = facultyData[currentFacultyIndex];
        if (!faculty) return;

        try {
            // 更新文字信息
            facultyTeamTxt.innerHTML = `
                    <h2 class="faculty-team-name">${faculty.name}</h2>
                    <div class="faculty-team-title">${faculty.title}</div>
                    <p class="faculty-team-description">
                        ${faculty.description}
                    </p>
                    <div class="faculty-team-details">
                        <div class="detail-item">
                            <span class="label">研究方向：</span>
                            <span class="value">${faculty.details.research}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">教授课程：</span>
                            <span class="value">${faculty.details.courses}</span>
                        </div>
                    </div>
                    <button class="show-more">展开更多</button>
                `;

            // 更新图片
            facultyImage.src = faculty.image;
            facultyImage.alt = faculty.name;

            // 更新分页指示器
            if (facultyDots.length > 0) {
                facultyDots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentFacultyIndex);
                });
            }

            // 重置展开状态
            isExpanded = false;
            const description = facultyTeamTxt.querySelector('.faculty-team-description');
            if (description) {
                description.style.webkitLineClamp = '4';
            }

            // 绑定展开更多按钮事件
            const showMoreBtn = facultyTeamTxt.querySelector('.show-more');
            if (showMoreBtn) {
                showMoreBtn.removeEventListener('click', toggleDescription);
                showMoreBtn.addEventListener('click', toggleDescription);
            }
        } catch (error) {
            console.error('更新老师显示时出错:', error);
        }
    }

    function toggleDescription() {
        const description = facultyTeamTxt.querySelector('.faculty-team-description');
        const showMoreBtn = facultyTeamTxt.querySelector('.show-more');

        if (!isExpanded) {
            description.style.webkitLineClamp = 'unset';
            description.style.maxHeight = 'none';
            showMoreBtn.textContent = '收起';
        } else {
            description.style.webkitLineClamp = '4';
            description.style.maxHeight = '7.2em';
            showMoreBtn.textContent = '展开更多';
        }

        isExpanded = !isExpanded;
    }

    function nextFaculty() {
        if (!isFacultyTransitioning) {
            isFacultyTransitioning = true;
            currentFacultyIndex = (currentFacultyIndex + 1) % facultyData.length;
            updateFacultyDisplay();
            setTimeout(() => {
                isFacultyTransitioning = false;
            }, 1000);
        }
    }

    function prevFaculty() {
        if (!isFacultyTransitioning) {
            isFacultyTransitioning = true;
            currentFacultyIndex = (currentFacultyIndex - 1 + facultyData.length) % facultyData.length;
            updateFacultyDisplay();
            setTimeout(() => {
                isFacultyTransitioning = false;
            }, 1000);
        }
    }

    function startFacultyAutoPlay() {
        stopFacultyAutoPlay();
        facultyAutoPlayTimer = setInterval(nextFaculty, 5000);
    }

    function stopFacultyAutoPlay() {
        if (facultyAutoPlayTimer) {
            clearInterval(facultyAutoPlayTimer);
        }
    }

    if (facultyPrevBtn) {
        facultyPrevBtn.addEventListener('click', () => {
            stopFacultyAutoPlay();
            prevFaculty();
            startFacultyAutoPlay();
        });
    }

    if (facultyNextBtn) {
        facultyNextBtn.addEventListener('click', () => {
            stopFacultyAutoPlay();
            nextFaculty();
            startFacultyAutoPlay();
        });
    }

    if (facultyDots && facultyDots.length > 0) {
        facultyDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (!isFacultyTransitioning && currentFacultyIndex !== index) {
                    isFacultyTransitioning = true;
                    stopFacultyAutoPlay();
                    currentFacultyIndex = index;
                    updateFacultyDisplay();
                    setTimeout(() => {
                        isFacultyTransitioning = false;
                    }, 1000);
                    startFacultyAutoPlay();
                }
            });
        });
    }

    facultyContent.addEventListener('mouseenter', stopFacultyAutoPlay);
    facultyContent.addEventListener('mouseleave', startFacultyAutoPlay);

    updateFacultyDisplay();
    startFacultyAutoPlay();
}
//顶部返回逻辑实现
function BackTop() {
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initCampusGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const loadMoreBtn = document.querySelector('.campus-footer .load-more');
    const categoryBtns = document.querySelectorAll('.category-btn');

    initFilterAndLoadMore('all');

    function initFilterAndLoadMore(category){
        const allItems = galleryGrid.querySelectorAll('.gallery-item');
        console.log(galleryGrid);
        console.log(allItems);

        //根据图片的张数是否超过六张来决定是否显示”更多按钮“
        if(allItems.length <= 4 && loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }else {
            loadMoreBtn.style.display = 'block';
        }

        //大前提(
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click',function (e) {
                galleryGrid.classList.add('show-all');
                this.style.display = 'none';

                const hiddenItems = galleryGrid.querySelectorAll('.gallery-item:nth-child(n+4)');
                hiddenItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.display = 'block';
                    }, index * 100);
                })
            })
        }
    }

    //分类按钮点击事件
        if(categoryBtns){
            categoryBtns.forEach(btn => {
                btn.addEventListener('click',function () {
                    categoryBtns.forEach(b => {
                        b.classList.remove('category-active');
                        btn.classList.add('category-active');

                        const category = btn.dataset.category;
                        initFilterAndLoadMore(category);
                    })
                })
            })
        }
}