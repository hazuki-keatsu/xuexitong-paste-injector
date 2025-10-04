(function () {
    'use strict';

    console.log('超星学习通粘贴注入器已启动', window.location.href);

    // 禁用各种弹窗函数
    function disablePopups() {
        window.alert = function () { };
        window.confirm = function () { return true; };
        window.prompt = function () { return null; };

        // 只拦截非关键的复制相关事件，保留 paste 和 contextmenu 让编辑器正常工作
        ['copy', 'cut', 'selectstart'].forEach(eventType => {
            document.addEventListener(eventType, function (e) {
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
            const newElement = contentToNode(content);

            innerBody.appendChild(newElement);
        });
    }

    function contentToNode(content: string): Node {
        const frag = document.createDocumentFragment();

        if (!content) return frag;

        // Normalize CRLF to LF
        const normalized = content.replace(/\r\n?/g, '\n');

        // Split into paragraphs by one or more blank lines (i.e. \n followed by optional spaces and another \n)
        const paragraphs = normalized.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);

        paragraphs.forEach(paragraphText => {
            const p = document.createElement('p');

            // Preserve single newlines inside a paragraph as <br>
            const lines = paragraphText.split('\n');
            lines.forEach((line, idx) => {
                p.appendChild(document.createTextNode(line));
                if (idx < lines.length - 1) {
                    p.appendChild(document.createElement('br'));
                }
            });

            frag.appendChild(p);
        });

        return frag;
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
                            console.log(`iframe ${index} window keydown:`, e.key, e.ctrlKey);
                            if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
                                // console.log(`iframe ${index} window 检测到 Ctrl+V`);
                                e.preventDefault();
                                injectContent();
                            }
                        }, true);

                        // 监听 paste 事件，支持鼠标右键粘贴
                        iframe.contentWindow?.addEventListener('paste', function (e) {
                            console.log(`iframe ${index} window 检测到 paste 事件`);
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            
                            // 尝试从事件中获取剪贴板数据
                            const clipboardData = e.clipboardData || (window as any).clipboardData;
                            if (clipboardData) {
                                const content = clipboardData.getData('text/plain');
                                if (content) {
                                    // 直接处理粘贴内容，不需要再调用 navigator.clipboard.readText()
                                    const iframe = document.activeElement as HTMLIFrameElement;
                                    if (iframe && iframe.contentDocument) {
                                        const innerBody = iframe.contentDocument.querySelector('body.view');
                                        if (innerBody) {
                                            const newElement = contentToNode(content);
                                            innerBody.appendChild(newElement);
                                        }
                                    }
                                }
                            } else {
                                // 回退到使用 navigator.clipboard API
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