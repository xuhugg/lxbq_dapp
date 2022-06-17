// 多语言切换
import i18n from "../../plugin/lang/i18n";

/**
 *
 * @param lang 切换的语言名称
 * @param resh 是否切换完成后刷新
 */
export function languageSwitch(lang,resh=false){
    i18n.locale = lang
    localStorage.setItem('lang',lang)
    if (resh){
        window.location.reload();
    }

}