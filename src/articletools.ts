export function parseArticlePageHtml(html: string): any | null {
    // 正则表达式：匹配包含 window.__INITIAL_STATE__ 的 script 标签
    const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g);

    if (scriptMatch) {
        // 遍历所有匹配到的 script 标签内容
        for (const script of scriptMatch) {
            // 查找包含 window.__INITIAL_STATE__ 的 script
            const initialStateMatch = script.match(/window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]*?\});/);
            if (initialStateMatch && initialStateMatch[1]) {
                try {
                    // 解析 JSON 并返回结果
                    return JSON.parse(initialStateMatch[1]);
                } catch (error) {
                    global.logger.error('Error parsing __INITIAL_STATE__:', error);
                }
            }
        }
    }

    // 如果没有找到 __INITIAL_STATE__，返回 null
    return null;
}

export function PatchArticleContent(doms: any) {
    try{
        global.logger.log("dom length: ", doms.length);

        // 使用显式的栈结构避免递归，防止栈溢出
        const stack = [...doms]; // 将所有dom节点放入栈中

        while (stack.length > 0) {
            const dom = stack.pop(); // 从栈顶取出一个节点

            if (!dom) continue; // 避免空节点

            if (dom.type === "img") {
                // 如果图片的 src 包含 .png 或 .jpg 扩展名
                if (dom.attributes.src.includes(".png") || dom.attributes.src.includes(".jpg")) {
                    // 确保 src 包含 http:// 或 https:// 前缀
                    if (
                        !(dom.attributes.src.startsWith("http://") || dom.attributes.src.startsWith("https://"))
                    ) {
                        dom.attributes.src = "https:" + dom.attributes.src;
                    }

                    if(dom.attributes){
                        // 如果图片过大，调整其尺寸
                        if (parseInt(dom.attributes.height) > 500 || parseInt(dom.attributes.height) > 500) {
                            dom.attributes.src += "@250h"; // 对应补丁操作
                            dom.attributes._patched_sign = "large_picture_scaled"
                        }
                    }
                } else {
                    // 替换为不支持的图片提示
                    dom.type = "hbhtmlrenderer-notsupportimage-tip";
                    dom.text = `暂不支持显示该类型的图片（${dom.attributes.src}）`;
                    dom.attributes = {};
                    dom.children = [];
                }
            }

            // 将子节点加入栈中继续处理
            if (dom.children && dom.children.length > 0) {
                stack.push(...dom.children); // 将子节点推入栈中继续处理
            }
        }
    }
    catch (e){
        global.logger.error("[articletools] Patch Error: " + e.toString())
    }
}

export function estimateReadingTime(htmlContent: string): number {
    const plainText = htmlContent.replace(/<\/?[^>]+(>|$)/g, "").trim();
    const wordCount = plainText.split(/\s+/).length;
    // 人类平均阅读速度为250字/分钟
    // 但在小屏幕上，速度会受限。
    const averageReadingSpeed = 100; // 字数/分钟
    const estimatedTime = Math.ceil(wordCount / averageReadingSpeed);

    return estimatedTime
}