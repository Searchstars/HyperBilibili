export function CreateLoadingAnimation(pageModel: any){
    // anims存在性检测
    if(!pageModel.anims){
        pageModel.anims = {}
    }

    // 创建动画元素
    pageModel.anims.loading_src = { value: "/common/seqanims/loadingWhite/icons8-loading_颜色反转-1.png" }

    pageModel.anims.loading = new global.animengine.SequenceAnim(
        pageModel.$page.name,
        pageModel.anims.loading_src,
        28,
        "/common/seqanims/loadingWhite/icons8-loading_颜色反转-*.png",
        1000,
        true
    )
    pageModel.anims.show_loading = true

    global.logger.log("[Animation Engine] Created Loading Animation for page", pageModel.$page.name)
}