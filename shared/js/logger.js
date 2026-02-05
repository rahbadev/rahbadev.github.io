/**
 * =====================================================
 * Logger - نظام تسجيل موحد
 * =====================================================
 * يوفر نظام logging منظم ومتسق
 * @version 1.0.0
 * @date 2026-02-05
 */

class Logger {
    constructor() {
        this.enabled = true;
        this.levels = {
            DEBUG: { value: 0, color: '#6b7280', icon: '🔍' },
            INFO: { value: 1, color: '#3b82f6', icon: 'ℹ️' },
            SUCCESS: { value: 2, color: '#10b981', icon: '✅' },
            WARN: { value: 3, color: '#f59e0b', icon: '⚠️' },
            ERROR: { value: 4, color: '#ef4444', icon: '❌' }
        };
        this.currentLevel = this.levels.INFO.value;
        this.history = [];
        this.maxHistory = 100;

        // تعطيل في بيئة الإنتاج
        if (this._isProduction()) {
            this.enabled = false;
            this.currentLevel = this.levels.ERROR.value;
        }
    }

    /**
     * التحقق من بيئة الإنتاج
     * @private
     */
    _isProduction() {
        return location.hostname !== 'localhost' &&
            location.hostname !== '127.0.0.1' &&
            !location.hostname.includes('192.168');
    }

    /**
     * تسجيل رسالة
     * @private
     */
    _log(level, message, data = null) {
        if (!this.enabled || this.levels[level].value < this.currentLevel) {
            return;
        }

        const timestamp = new Date().toISOString();
        const logEntry = { level, message, data, timestamp };

        // إضافة للتاريخ
        this.history.push(logEntry);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        const levelInfo = this.levels[level];
        const prefix = `${levelInfo.icon} [${level}]`;

        const style = `color: ${levelInfo.color}; font-weight: bold;`;

        if (data) {
            console.log(`%c${prefix}`, style, message, data);
        } else {
            console.log(`%c${prefix}`, style, message);
        }
    }

    /**
     * رسائل التطوير/التصحيح
     */
    debug(message, data = null) {
        this._log('DEBUG', message, data);
    }

    /**
     * رسائل معلوماتية
     */
    info(message, data = null) {
        this._log('INFO', message, data);
    }

    /**
     * رسائل النجاح
     */
    success(message, data = null) {
        this._log('SUCCESS', message, data);
    }

    /**
     * رسائل التحذير
     */
    warn(message, data = null) {
        this._log('WARN', message, data);
    }

    /**
     * رسائل الأخطاء
     */
    error(message, error = null) {
        this._log('ERROR', message, error);

        // إرسال للتحليلات (اختياري)
        this._sendToAnalytics(message, error);
    }

    /**
     * مجموعة رسائل
     */
    group(title, collapsed = false) {
        if (!this.enabled) return;

        if (collapsed) {
            console.groupCollapsed(`📦 ${title}`);
        } else {
            console.group(`📦 ${title}`);
        }
    }

    /**
     * إنهاء المجموعة
     */
    groupEnd() {
        if (!this.enabled) return;
        console.groupEnd();
    }

    /**
     * جدول البيانات
     */
    table(data, columns = null) {
        if (!this.enabled) return;

        if (columns) {
            console.table(data, columns);
        } else {
            console.table(data);
        }
    }

    /**
     * قياس الوقت
     */
    time(label) {
        if (!this.enabled) return;
        console.time(`⏱️ ${label}`);
    }

    /**
     * إنهاء قياس الوقت
     */
    timeEnd(label) {
        if (!this.enabled) return;
        console.timeEnd(`⏱️ ${label}`);
    }

    /**
     * تتبع الأداء
     */
    profile(name) {
        if (!this.enabled) return;
        console.profile(name);
    }

    /**
     * إنهاء تتبع الأداء
     */
    profileEnd(name) {
        if (!this.enabled) return;
        console.profileEnd(name);
    }

    /**
     * استرجاع سجل الرسائل
     */
    getHistory(level = null) {
        if (level) {
            return this.history.filter(entry => entry.level === level);
        }
        return this.history;
    }

    /**
     * تنظيف السجل
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * تعيين مستوى التسجيل
     */
    setLevel(level) {
        if (this.levels[level]) {
            this.currentLevel = this.levels[level].value;
        }
    }

    /**
     * تفعيل/تعطيل التسجيل
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * إرسال الأخطاء للتحليلات
     * @private
     */
    _sendToAnalytics(message, error) {
        // يمكن إضافة تكامل مع Google Analytics أو Sentry هنا
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: message,
                fatal: false
            });
        }
    }
}

// إنشاء نسخة عامة
const logger = new Logger();

// تصدير للاستخدام في الmodules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Logger, logger };
}
