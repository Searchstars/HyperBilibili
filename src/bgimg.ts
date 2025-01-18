import { router } from "./tsimports";

let BGIMG_STYLES: any = {}

let BGIMG_PAGES_MAP: any = {}

export function Init(){
    var screenShape = global.DEVICE_INFO.screenShape

    BGIMG_STYLES = {
        Default: `/common/pagebg/${screenShape}/pink.png`,
        Pink: `/common/pagebg/${screenShape}/pink.png`,
        Yellow: `/common/pagebg/${screenShape}/yellow.png`,
        Blue: `/common/pagebg/${screenShape}/blue.png`
    }

    BGIMG_PAGES_MAP = {
        "pages/app/features/main": BGIMG_STYLES.Pink,
        "pages/app/features/dynamic": BGIMG_STYLES.Pink,
        "pages/app/features/savedcontent": BGIMG_STYLES.Yellow,
        "pages/search/search": BGIMG_STYLES.Blue,
        "pages/search/searchresult": BGIMG_STYLES.Blue
    }
}

export function GetBackgroundImageSrc(){
    global.logger.log("[GetBackgroundImageSrc] Getting")
    var pageName = router.getState().name
    global.logger.log("[GetBackgroundImageSrc]", router.getState().name, BGIMG_PAGES_MAP[pageName])
    return BGIMG_PAGES_MAP[pageName]
}