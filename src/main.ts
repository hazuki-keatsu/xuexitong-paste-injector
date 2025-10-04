(function () {
    'use strict';
    
    console.log('超星学习通粘贴注入器已启动', window.location.href);

    // 禁用各种弹窗函数
    function disablePopups() {
        window.alert = function() {};
        window.confirm = function() { return true; };
        window.prompt = function() { return null; };
        
        // 拦截所有可能的复制相关事件
        ['copy', 'cut', 'paste', 'selectstart', 'contextmenu'].forEach(eventType => {
            document.addEventListener(eventType, function(e) {
                e.stopImmediatePropagation();
            }, true);
        });
    }

    // 页面加载时立即禁用弹窗
    window.addEventListener("load", disablePopups);

    // 直接注入内容到输入框
    function injectContent() {
        // 1. 使用监听器获取对应的 iframe id（调试使用）
        window.addEventListener('focus', () => {
            const active = document.activeElement;
            if (active && active.tagName === 'IFRAME') {
                const iframe = active as HTMLIFrameElement;
                // console.log('当前聚焦的iframe id:', iframe.id);
            }
        }, true); // 使用捕获阶段，能捕获到 iframe 的聚焦

        // 2. 找到目标 iframe DOM
        let iframe: HTMLIFrameElement | null = null;
        const active = document.activeElement;
        if (active && active.tagName === 'IFRAME') {
            iframe = active as HTMLIFrameElement;
        }
        let innerBody = null;
        if (iframe && iframe.contentDocument) {
            innerBody = iframe.contentDocument.querySelector('body.view');
        }
        if (!innerBody) return;

        // 3. 注入内容（直接读取剪切板）
        navigator.clipboard.readText().then(content => {
            if (!content) return;
            const newP = innerBody.ownerDocument.createElement('p');
            newP.textContent = content;
            innerBody.appendChild(newP);
        });
    }

    // 监听 UEditor iframe 内部的键盘事件
    function setupUEditorListeners() {
        // console.log('设置 UEditor 监听器');
        
        // 查找所有 iframe（UEditor 通常在 iframe 中）
        function findAndSetupIframes() {
            const iframes = document.querySelectorAll('iframe');
            // console.log('找到 iframe 数量:', iframes.length);
            
            iframes.forEach((iframe, index) => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) {
                        // console.log(`为 iframe ${index} 设置监听器`);
                        
                        // 监听 iframe 的 window
                        iframe.contentWindow?.addEventListener('keydown', function (e) {
                            // console.log(`iframe ${index} window keydown:`, e.key, e.ctrlKey);
                            if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
                                // console.log(`iframe ${index} window 检测到 Ctrl+V`);
                                injectContent();
                            }
                        }, true);
                    }
                } catch (error: any) {
                    console.log(`iframe ${index} 跨域限制:`, error.message);
                }
            });
        }
        
        // 立即检查
        findAndSetupIframes();
    }
    
    // 设置监听器
    window.addEventListener("load", setupUEditorListeners);
})();