/**
 * ============================================================
 *  FICHIER : utils.gs
 *  MODULE  : RP BUSINESS SYSTEM — UTILS
 *  VERSION : PRO 2026
 * ============================================================
 */

var utils = {

  generateID: function (prefix) {
    const now = new Date();
    const stamp = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyyMMddHHmmss");
    const rand = Math.floor(Math.random() * 1000);
    return prefix + "_" + stamp + "_" + Utilities.formatString("%03d", rand);
  },

  generateEntrepriseKey: function () {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let key = "";
    for (let i = 0; i < 10; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

};