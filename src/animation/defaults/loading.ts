export function CreateLoadingAnimation(pageModel: any, colorReverse = true){
    // anims存在性检测
    if(!pageModel.anims){
        pageModel.anims = {}
    }

    var folderName = "loadingWhite"
    var addStr = "_颜色反转"
    if(!colorReverse){
        folderName = "loading"
        addStr = ""
    }

    // 创建动画元素
    pageModel.anims.loading_src = { value: `/common/seqanims/${folderName}/icons8-loading${addStr}-1.png` }

    pageModel.anims.loading = new global.animengine.SequenceAnim(
        pageModel.$page.name,
        pageModel.anims.loading_src,
        28,
        `/common/seqanims/${folderName}/icons8-loading${addStr}-*.png`,
        1000,
        true
    )
    pageModel.anims.show_loading = true

    global.logger.log("[Animation Engine] Created Loading Animation for page", pageModel.$page.name)
}