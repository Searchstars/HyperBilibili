interface GlobalAnimations {
    [key: string]: Array<Anim>;
}

declare var global: {
    animations: GlobalAnimations | undefined;
};

abstract class Anim {
    abstract start(): void;
    abstract stop(): void;
}

class SequenceAnim extends Anim {
    pageId: string;
    currentFramePathRef: { value: string };
    frameCount: number;
    framePathPattern: string;
    baseDuration: number;
    loop: boolean;
    currentFrame: number;
    intervalId: NodeJS.Timeout | null;

    constructor(pageId: string, currentFramePathRef: { value: string }, frameCount: number, framePathPattern: string, baseDuration: number, loop = false) {
        super();
        this.pageId = pageId;
        this.currentFramePathRef = currentFramePathRef;
        this.frameCount = frameCount;
        this.framePathPattern = framePathPattern;
        this.baseDuration = baseDuration;
        this.loop = loop;

        this.currentFrame = 1;
        this.intervalId = null;

        if (!global.animations) {
            global.animations = {};
        }
        if (!global.animations[pageId]) {
            global.animations[pageId] = [];
        }
        global.animations[pageId].push(this);
    }

    start(): void {
        const frameDuration = this.baseDuration / this.frameCount;
        const updateFrame = () => {
            this.currentFramePathRef.value = this.framePathPattern.replace('*', this.currentFrame.toString());

            this.currentFrame++;
            if (this.currentFrame > this.frameCount) {
                if (this.loop) {
                    this.currentFrame = 1;
                } else {
                    clearInterval(this.intervalId!);
                }
            }
        };

        this.intervalId = setInterval(updateFrame, frameDuration);
    }

    stop(): void {
        clearInterval(this.intervalId!);
    }
}

class DomAnim extends Anim {
    pageId: string;
    marginLeftRef: { value: string };
    marginTopRef: { value: string };
    targetMarginLeft: number;
    targetMarginTop: number;
    duration: number;
    startTime: number | null;
    intervalId: NodeJS.Timeout | null;

    constructor(pageId: string, marginLeftRef: { value: string }, marginTopRef: { value: string }, targetMarginLeft: number, targetMarginTop: number, duration: number) {
        super();
        this.pageId = pageId;
        this.marginLeftRef = marginLeftRef;
        this.marginTopRef = marginTopRef;
        this.targetMarginLeft = targetMarginLeft;
        this.targetMarginTop = targetMarginTop;
        this.duration = duration;

        this.startTime = null;
        this.intervalId = null;

        if (!global.animations) {
            global.animations = {};
        }
        if (!global.animations[pageId]) {
            global.animations[pageId] = [];
        }
        global.animations[pageId].push(this);
    }

    start(): void {
        this.startTime = Date.now();
        const startMarginLeft = parseFloat(this.marginLeftRef.value);
        const startMarginTop = parseFloat(this.marginTopRef.value);

        const step = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - this.startTime!;

            if (elapsed >= this.duration) {
                this.marginLeftRef.value = this.targetMarginLeft.toString();
                this.marginTopRef.value = this.targetMarginTop.toString();
                clearInterval(this.intervalId!);
            } else {
                const progress = elapsed / this.duration;
                const newMarginLeft = startMarginLeft + (this.targetMarginLeft - startMarginLeft) * progress;
                const newMarginTop = startMarginTop + (this.targetMarginTop - startMarginTop) * progress;
                this.marginLeftRef.value = newMarginLeft.toString();
                this.marginTopRef.value = newMarginTop.toString();
            }
        };

        this.intervalId = setInterval(step, 16); // 60 FPS
    }

    stop(): void {
        clearInterval(this.intervalId!);
    }
}

function clearPageAnims(pageId: string): void {
    if (global.animations && global.animations[pageId]) {
        global.animations[pageId].forEach(anim => anim.stop());
        delete global.animations[pageId];
    }
}

export { SequenceAnim, DomAnim, clearPageAnims };