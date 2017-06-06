webpackJsonpCoveo__temporary([14,22,47],{

/***/ 248:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var ResultLink_1 = __webpack_require__(77);
var Initialization_1 = __webpack_require__(2);
var DomUtils_1 = __webpack_require__(43);
var Dom_1 = __webpack_require__(3);
var ExternalModulesShim_1 = __webpack_require__(22);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
var RegisteredNamedMethods_1 = __webpack_require__(57);
/**
 * The YouTubeThumbnail component automatically fetches the thumbnail of a YouTube video.
 *
 * This component differs from the standard {@link Thumbnail} component because the thumbnail it outputs is always
 * clickable.
 *
 * Depending on the component configuration, clicking a YouTube thumbnail can either automatically open a modal box
 * containing the `iframe` from YouTube, or open the target URL in the current window (see
 * {@link YouTubeThumbnail.options.embed}).
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
var YouTubeThumbnail = (function (_super) {
    __extends(YouTubeThumbnail, _super);
    function YouTubeThumbnail(element, options, bindings, result, ModalBox) {
        if (ModalBox === void 0) { ModalBox = ExternalModulesShim_1.ModalBox; }
        var _this = _super.call(this, element, YouTubeThumbnail.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.ModalBox = ModalBox;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, YouTubeThumbnail, options);
        _this.resultLink = Dom_1.$$('a');
        _this.resultLink.addClass(Component_1.Component.computeCssClassName(ResultLink_1.ResultLink));
        var thumbnailDiv = Dom_1.$$('div');
        thumbnailDiv.addClass('coveo-youtube-thumbnail-container');
        _this.resultLink.append(thumbnailDiv.el);
        var img = Dom_1.$$('img');
        img.el.style.width = _this.options.width;
        img.el.style.height = _this.options.height;
        img.setAttribute('src', result.raw['ytthumbnailurl']);
        img.addClass('coveo-youtube-thumbnail-img');
        thumbnailDiv.append(img.el);
        var span = Dom_1.$$('span');
        span.addClass('coveo-youtube-thumbnail-play-button');
        thumbnailDiv.append(span.el);
        Dom_1.$$(_this.element).append(_this.resultLink.el);
        if (_this.options.embed) {
            _this.options = _.extend(_this.options, {
                onClick: function () { return _this.openYoutubeIframe(); }
            });
        }
        var initOptions = _this.searchInterface.options.originalOptionsObject;
        var resultComponentBindings = _.extend({}, _this.getBindings(), {
            resultElement: element
        });
        var initParameters = {
            options: _.extend({}, { initOptions: { ResultLink: options } }, initOptions),
            bindings: resultComponentBindings,
            result: result
        };
        Initialization_1.Initialization.automaticallyCreateComponentsInside(element, initParameters);
        return _this;
    }
    /**
     * Open the result link embedded in this component.
     *
     * With a standard configuration of this component, this will open an iframe that automatically plays the video.
     */
    YouTubeThumbnail.prototype.openResultLink = function () {
        var resultLinkComponent = RegisteredNamedMethods_1.get(this.resultLink.el);
        resultLinkComponent.openLinkAsConfigured();
    };
    YouTubeThumbnail.prototype.openYoutubeIframe = function () {
        var _this = this;
        // need to put iframe inside div : iframe with position absolute and left:0, right : 0 , bottom: 0 is not standard/supported
        var iframe = Dom_1.$$('iframe'), div = Dom_1.$$('div');
        iframe.setAttribute('src', 'https://www.youtube.com/embed/' + this.extractVideoId() + '?autoplay=1');
        iframe.setAttribute('allowfullscreen', 'allowfullscreen');
        iframe.setAttribute('webkitallowfullscreen', 'webkitallowfullscreen');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '100%');
        div.append(iframe.el);
        this.modalbox = this.ModalBox.open(div.el, {
            overlayClose: true,
            title: DomUtils_1.DomUtils.getQuickviewHeader(this.result, { showDate: true, title: this.result.title }, this.bindings).el.outerHTML,
            className: 'coveo-youtube-player',
            validation: function () { return true; },
            body: this.element.ownerDocument.body,
            sizeMod: 'big'
        });
        Dom_1.$$(Dom_1.$$(this.modalbox.wrapper).find('.coveo-quickview-close-button')).on('click', function () {
            _this.modalbox.close();
        });
    };
    YouTubeThumbnail.prototype.extractVideoId = function () {
        return this.result.clickUri.split('watch?v=')[1];
    };
    return YouTubeThumbnail;
}(Component_1.Component));
YouTubeThumbnail.ID = 'YouTubeThumbnail';
YouTubeThumbnail.doExport = function () {
    GlobalExports_1.exportGlobally({
        'YouTubeThumbnail': YouTubeThumbnail
    });
};
/**
 * @componentOptions
 */
YouTubeThumbnail.options = {
    /**
     * Specifies the width (in pixels) of the YouTube thumbnail.
     *
     * Default value is `200px`.
     */
    width: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '200px' }),
    /**
     * Specifies the height (in pixels) of the YouTube thumbnail.
     *
     * Default value is `112px`.
     */
    height: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '112px' }),
    /**
     * Specifies whether clicking on the YouTube thumbnail loads the video in a modal box.
     *
     * Setting this option to `false` causes the browser to change its current location to that of the target URL when
     * the end user clicks the YouTube thumbnail.
     *
     * Default value is `true`.
     */
    embed: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
};
exports.YouTubeThumbnail = YouTubeThumbnail;
Initialization_1.Initialization.registerAutoCreateComponent(YouTubeThumbnail);


/***/ }),

/***/ 283:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var Initialization_1 = __webpack_require__(2);
var _ = __webpack_require__(1);
var Utils_1 = __webpack_require__(5);
var GlobalExports_1 = __webpack_require__(4);
var YouTubeThumbnail_1 = __webpack_require__(248);
var Dom_1 = __webpack_require__(3);
var ExternalModulesShim_1 = __webpack_require__(22);
__webpack_require__(550);
/**
 * The Backdrop component renders an image URL (either passed as a direct URL or contained in a result field) as a
 * background image. It is useful for displaying information in front of a dynamic background image.
 *
 * The Backdrop component will automatically initialize components embedded within itself:
 *
 * ```html
 *   <div class="CoveoBackdrop" data-image-field="ytthumbnailurl">
 *     <div class="CoveoFieldValue" data-field="somefield"></div>
 *   </div>
 * ```
 */
var Backdrop = (function (_super) {
    __extends(Backdrop, _super);
    /**
     * Creates a new Backdrop component.
     * @param element The HTMLElement on which the component will be instantiated.
     * @param options The options for the Backdrop component.
     * @param bindings The bindings that the component requires to function normally. If not set, it will be automatically
     * resolved (with a slower execution time).
     * @param result The {@link IQueryResult}.
     */
    function Backdrop(element, options, bindings, result, _window, ModalBox) {
        if (ModalBox === void 0) { ModalBox = ExternalModulesShim_1.ModalBox; }
        var _this = _super.call(this, element, Backdrop.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this._window = _window;
        _this.ModalBox = ModalBox;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Backdrop, options);
        _this._window = _this._window || window;
        var background = '';
        if (_this.options.overlayColor) {
            background += "linear-gradient(" + _this.options.overlayColor + ", "
                + (_this.options.overlayGradient ? 'rgba(0,0,0,0)' : _this.options.overlayColor) + '), ';
        }
        var imageSource = _this.options.imageUrl || Utils_1.Utils.getFieldValue(result, _this.options.imageField);
        background += "url('" + imageSource + "') center center";
        _this.element.style.background = background;
        _this.element.style.backgroundSize = 'cover';
        // Initialize components inside
        var initOptions = _this.searchInterface.options.originalOptionsObject;
        var resultComponentBindings = _.extend({}, _this.getBindings(), {
            resultElement: element
        });
        var initParameters = {
            options: _.extend({}, { initOptions: { ResultLink: options } }, initOptions),
            bindings: resultComponentBindings,
            result: result
        };
        Initialization_1.Initialization.automaticallyCreateComponentsInside(_this.element, initParameters);
        _this.configureSpecialBackdropActions();
        return _this;
    }
    Backdrop.prototype.configureSpecialBackdropActions = function () {
        // If the current backdrop is used for a youtube thumbnail, we automatically configure a component for this
        if (Utils_1.Utils.getFieldValue(this.result, 'ytthumbnailurl')) {
            // We create the element "in memory", but do not append it to the DOM.
            // We don't want to see a duplicate of the preview for youtube : the backdrop already renders a preview.
            var thumbnailYouTube_1 = new YouTubeThumbnail_1.YouTubeThumbnail(Dom_1.$$('div').el, {
                embed: true
            }, this.getBindings(), this.result, this.ModalBox);
            Dom_1.$$(this.element).on('click', function (e) {
                // Since the backdrop often contain a result link, we must make sure the click did no originate from one.
                // Otherwise, we might end up opening 2 results at the same time
                if (!Dom_1.$$(e.target).hasClass('CoveoResultLink')) {
                    thumbnailYouTube_1.openResultLink();
                }
            });
        }
    };
    return Backdrop;
}(Component_1.Component));
Backdrop.ID = 'Backdrop';
Backdrop.doExport = function () {
    GlobalExports_1.exportGlobally({
        'Backdrop': Backdrop
    });
};
/**
 * @componentOptions
 */
Backdrop.options = {
    /**
     * Specifies a direct URL from which the background image will be sourced.
     *
     * Has priority over {@link Backdrop.options.imageField}.
     */
    imageUrl: ComponentOptions_1.ComponentOptions.buildStringOption(),
    /**
     * Specifies the field from which the background image will be pulled.
     *
     * If {@link Backdrop.options.imageUrl} is specified, it will override this option.
     */
    imageField: ComponentOptions_1.ComponentOptions.buildFieldOption(),
    /**
     * Specifies the color that will be overlaid on top of the background image.
     * This option needs to be declared as a CSS color. Be sure to use RGBA with an alpha value lower than 1 in order to
     * be able to see the image behind the overlay color.
     *
     * Example value : "`rgba(101, 123, 76, 0.5)`"
     */
    overlayColor: ComponentOptions_1.ComponentOptions.buildColorOption(),
    /**
     * Specifies whether the overlay color should be instead be rendered as a top-to-bottom gradient from
     * {@link Backdrop.options.overlayColor} to transparent.
     *
     * Default value is `false`.
     */
    overlayGradient: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'overlayColor' }),
};
exports.Backdrop = Backdrop;
Initialization_1.Initialization.registerAutoCreateComponent(Backdrop);


/***/ }),

/***/ 446:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 550:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 77:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var ComponentOptionsModel_1 = __webpack_require__(25);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var ResultListEvents_1 = __webpack_require__(30);
var HighlightUtils_1 = __webpack_require__(44);
var DeviceUtils_1 = __webpack_require__(18);
var OSUtils_1 = __webpack_require__(243);
var Initialization_1 = __webpack_require__(2);
var QueryUtils_1 = __webpack_require__(17);
var Assert_1 = __webpack_require__(7);
var Utils_1 = __webpack_require__(5);
var Defer_1 = __webpack_require__(26);
var Dom_1 = __webpack_require__(3);
var StreamHighlightUtils_1 = __webpack_require__(63);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
__webpack_require__(446);
/**
 * The `ResultLink` component automatically transform a search result title into a clickable link pointing to the
 * original item.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
var ResultLink = (function (_super) {
    __extends(ResultLink, _super);
    /**
     * Creates a new `ResultLink` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `ResultLink` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     * @param os
     */
    function ResultLink(element, options, bindings, result, os) {
        var _this = _super.call(this, element, ResultLink.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.os = os;
        _this.logOpenDocument = _.debounce(function () {
            _this.queryController.saveLastQuery();
            var documentURL = Dom_1.$$(_this.element).getAttribute('href');
            if (documentURL == undefined || documentURL == '') {
                documentURL = _this.result.clickUri;
            }
            _this.usageAnalytics.logClickEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.documentOpen, {
                documentURL: documentURL,
                documentTitle: _this.result.title,
                author: Utils_1.Utils.getFieldValue(_this.result, 'author'),
            }, _this.result, _this.root);
            Defer_1.Defer.flush();
        }, 1500, true);
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultLink, options);
        _this.options = _.extend({}, _this.options, _this.componentOptionsModel.get(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.resultLink));
        _this.result = result || _this.resolveResult();
        if (_this.options.openQuickview == null) {
            _this.options.openQuickview = result.raw['connectortype'] == 'ExchangeCrawler' && DeviceUtils_1.DeviceUtils.isMobileDevice();
        }
        _this.element.setAttribute('tabindex', '0');
        Assert_1.Assert.exists(_this.componentOptionsModel);
        Assert_1.Assert.exists(_this.result);
        if (!_this.quickviewShouldBeOpened()) {
            // We assume that anytime the contextual menu is opened on a result link
            // this is do "open in a new tab" or something similar.
            // This is not 100% accurate, but we estimate it to be the lesser of 2 evils (not logging anything)
            Dom_1.$$(element).on('contextmenu', function () {
                _this.logOpenDocument();
            });
            Dom_1.$$(element).on('click', function () {
                _this.logOpenDocument();
            });
        }
        _this.renderUri(element, result);
        _this.bindEventToOpen();
        return _this;
    }
    ResultLink.prototype.renderUri = function (element, result) {
        if (/^\s*$/.test(this.element.innerHTML)) {
            if (!this.options.titleTemplate) {
                this.element.innerHTML = this.result.title ? HighlightUtils_1.HighlightUtils.highlightString(this.result.title, this.result.titleHighlights, null, 'coveo-highlight') : this.result.clickUri;
            }
            else {
                var newTitle = this.parseStringTemplate(this.options.titleTemplate);
                this.element.innerHTML = newTitle ? StreamHighlightUtils_1.StreamHighlightUtils.highlightStreamText(newTitle, this.result.termsToHighlight, this.result.phrasesToHighlight) : this.result.clickUri;
            }
        }
    };
    /**
     * Opens the result in the same window, no matter how the actual component is configured for the end user.
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLink = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (logAnalytics) {
            this.logOpenDocument();
        }
        window.location.href = this.getResultUri();
    };
    /**
     * Opens the result in a new window, no matter how the actual component is configured for the end user.
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLinkInNewWindow = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (logAnalytics) {
            this.logOpenDocument();
        }
        window.open(this.getResultUri(), '_blank');
    };
    /**
     * Tries to open the result in Microsoft Outlook if the result has an `outlookformacuri` or `outlookuri` field.
     *
     * Normally, this implies the result should be a link to an email.
     *
     * If the needed fields are not present, this method does nothing.
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLinkInOutlook = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (this.hasOutlookField()) {
            if (logAnalytics) {
                this.logOpenDocument();
            }
            this.openLink();
        }
    };
    /**
     * Opens the link in the same manner the end user would.
     *
     * This essentially simulates a click on the result link.
     *
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLinkAsConfigured = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (this.toExecuteOnOpen) {
            if (logAnalytics) {
                this.logOpenDocument();
            }
            this.toExecuteOnOpen();
        }
    };
    ResultLink.prototype.bindEventToOpen = function () {
        return this.bindOnClickIfNotUndefined() || this.bindOpenQuickviewIfNotUndefined() || this.setHrefIfNotAlready() || this.openLinkThatIsNotAnAnchor();
    };
    ResultLink.prototype.bindOnClickIfNotUndefined = function () {
        var _this = this;
        if (this.options.onClick != undefined) {
            this.toExecuteOnOpen = function (e) {
                _this.options.onClick.call(_this, e, _this.result);
            };
            Dom_1.$$(this.element).on('click', function (e) {
                _this.toExecuteOnOpen(e);
            });
            return true;
        }
        else {
            return false;
        }
    };
    ResultLink.prototype.bindOpenQuickviewIfNotUndefined = function () {
        var _this = this;
        if (this.quickviewShouldBeOpened()) {
            this.toExecuteOnOpen = function () {
                Dom_1.$$(_this.bindings.resultElement).trigger(ResultListEvents_1.ResultListEvents.openQuickview);
            };
            Dom_1.$$(this.element).on('click', function (e) {
                e.preventDefault();
                _this.toExecuteOnOpen();
            });
            return true;
        }
        else {
            return false;
        }
    };
    ResultLink.prototype.openLinkThatIsNotAnAnchor = function () {
        var _this = this;
        if (!this.elementIsAnAnchor()) {
            this.toExecuteOnOpen = function () {
                if (_this.options.alwaysOpenInNewWindow) {
                    if (_this.options.openInOutlook) {
                        _this.openLinkInOutlook();
                    }
                    else {
                        _this.openLinkInNewWindow();
                    }
                }
                else {
                    _this.openLink();
                }
            };
            Dom_1.$$(this.element).on('click', function () {
                _this.toExecuteOnOpen();
            });
            return true;
        }
        return false;
    };
    ResultLink.prototype.setHrefIfNotAlready = function () {
        // Do not erase any value put in href by the template, etc. Allows
        // using custom click urls while still keeping analytics recording
        // and other behavior brought by the component.
        if (this.elementIsAnAnchor() && !Utils_1.Utils.isNonEmptyString(Dom_1.$$(this.element).getAttribute('href'))) {
            Dom_1.$$(this.element).setAttribute('href', this.getResultUri());
            if (this.options.alwaysOpenInNewWindow && !(this.options.openInOutlook && this.hasOutlookField())) {
                Dom_1.$$(this.element).setAttribute('target', '_blank');
            }
            return true;
        }
        else {
            return false;
        }
    };
    ResultLink.prototype.getResultUri = function () {
        if (this.options.hrefTemplate) {
            return this.parseStringTemplate(this.options.hrefTemplate);
        }
        if (this.options.field == undefined && this.options.openInOutlook) {
            this.setField();
        }
        if (this.options.field != undefined) {
            return Utils_1.Utils.getFieldValue(this.result, this.options.field);
        }
        else {
            return this.result.clickUri;
        }
    };
    ResultLink.prototype.elementIsAnAnchor = function () {
        return this.element.tagName == 'A';
    };
    ResultLink.prototype.setField = function () {
        var os = Utils_1.Utils.exists(this.os) ? this.os : OSUtils_1.OSUtils.get();
        if (os == OSUtils_1.OS_NAME.MACOSX && this.hasOutlookField()) {
            this.options.field = '@outlookformacuri';
        }
        else if (os == OSUtils_1.OS_NAME.WINDOWS && this.hasOutlookField()) {
            this.options.field = '@outlookuri';
        }
    };
    ResultLink.prototype.hasOutlookField = function () {
        var os = Utils_1.Utils.exists(this.os) ? this.os : OSUtils_1.OSUtils.get();
        if (os == OSUtils_1.OS_NAME.MACOSX && this.result.raw['outlookformacuri'] != undefined) {
            return true;
        }
        else if (os == OSUtils_1.OS_NAME.WINDOWS && this.result.raw['outlookuri'] != undefined) {
            return true;
        }
        return false;
    };
    ResultLink.prototype.isUriThatMustBeOpenedInQuickview = function () {
        return this.result.clickUri.toLowerCase().indexOf('ldap://') == 0;
    };
    ResultLink.prototype.quickviewShouldBeOpened = function () {
        return (this.options.openQuickview || this.isUriThatMustBeOpenedInQuickview()) && QueryUtils_1.QueryUtils.hasHTMLVersion(this.result);
    };
    ResultLink.prototype.parseStringTemplate = function (template) {
        var _this = this;
        if (!template) {
            return '';
        }
        return template.replace(/\$\{(.*?)\}/g, function (value) {
            var key = value.substring(2, value.length - 1);
            var newValue = _this.readFromObject(_this.result, key);
            if (!newValue) {
                newValue = _this.readFromObject(window, key);
            }
            if (!newValue) {
                _this.logger.warn(key + " used in the ResultLink template is undefined for this result: " + _this.result.title);
            }
            return newValue || value;
        });
    };
    ResultLink.prototype.readFromObject = function (object, key) {
        if (object && key.indexOf('.') !== -1) {
            var newKey = key.substring(key.indexOf('.') + 1);
            key = key.substring(0, key.indexOf('.'));
            return this.readFromObject(object[key], newKey);
        }
        return object ? object[key] : undefined;
    };
    return ResultLink;
}(Component_1.Component));
ResultLink.ID = 'ResultLink';
ResultLink.doExport = function () {
    GlobalExports_1.exportGlobally({
        'ResultLink': ResultLink
    });
};
/**
 * The options for the ResultLink
 * @componentOptions
 */
ResultLink.options = {
    /**
     * Specifies the field to use to output the component `href` attribute value.
     *
     * **Tip:**
     * > Instead of specifying a value for the `field` option, you can directly add an `href` attribute to the
     * > `ResultLink` HTML element. Then, you can use a custom script to generate the `href` value.
     *
     * **Examples:**
     * - With the following markup, the `ResultLink` outputs its `href` value using the `@uri` field (rather than the
     * default field):
     *
     * ```html
     * <a class="CoveoResultLink" field="@uri"></a>
     * ```
     *
     * - In the following result template, the custom `getMyKBUri()` function provides the `href` value:
     *
     * ```html
     * <script id="KnowledgeArticle" type="text/underscore" class="result-template">
     *   <div class='CoveoIcon>'></div>
     *   <a class="CoveoResultLink" href="<%= getMyKBUri(raw) %>"></a>
     *   <div class="CoveoExcerpt"></div>
     * </script>
     * ```
     *
     * See also [`hrefTemplate`]{@link ResultLink.options.hrefTemplate}, which can override this option.
     *
     * By default, the component uses the `@clickUri` field of the item to output the value of its `href` attribute.
     */
    field: ComponentOptions_1.ComponentOptions.buildFieldOption(),
    /**
     * Specifies whether the component should try to open its link in Microsoft Outlook.
     *
     * Setting this option to `true` is normally useful for `ResultLink` instances related to Microsoft Exchange emails.
     *
     * If this option is `true`, clicking the `ResultLink` calls the
     * [`openLinkInOutlook`]{@link ResultLink.openLinkInOutlook} method instead of the
     * [`openLink`]{@link ResultLink.openLink} method.
     *
     * Default value is `false`.
     */
    openInOutlook: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies whether the component should open its link in the [`Quickview`]{@link Quickview} component rather than
     * loading through the original URL.
     *
     * Default value is `false`.
     */
    openQuickview: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies whether the component should open its link in a new window instead of opening it in the current
     * context.
     *
     * If this option is `true`, clicking the `ResultLink` calls the
     * [`openLinkInNewWindow`]{@link ResultLink.openLinkInNewWindow} method instead of the
     * [ `openLink`]{@link ResultLink.openLink} method.
     *
     * **Note:**
     * > If a search page contains a [`ResultPreferences`]{@link ResultsPreferences} component whose
     * > [`enableOpenInNewWindow`]{@link ResultsPreferences.options.enableOpenInNewWindow} option is `true`, and the end
     * > user checks the <b>Always open results in new window</b> box, `ResultLink` components in this page will always
     * > open their links in a new window when the end user clicks them, no matter what the value of their
     * > `alwaysOpenInNewWindow` option is.
     *
     * Default value is `false`.
     */
    alwaysOpenInNewWindow: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies a template literal from which to generate the `ResultLink` `href` attribute value (see
     * [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)).
     *
     * This option overrides the [`field`]{@link ResultLink.options.field} option value.
     *
     * The template literal can reference any number of fields from the parent result. It can also reference global
     * scope properties.
     *
     * **Examples:**
     *
     * - The following markup generates an `href` value such as `http://uri.com?id=itemTitle`:
     *
     * ```html
     * <a class='CoveoResultLink' data-href-template='${clickUri}?id=${title}'></a>
     * ```
     *
     * - The following markup generates an `href` value such as `localhost/fooBar`:
     *
     * ```html
     * <a class='CoveoResultLink' data-href-template='${window.location.hostname}/{Foo.Bar}'></a>
     * ```
     *
     * Default value is `undefined`.
     */
    hrefTemplate: ComponentOptions_1.ComponentOptions.buildStringOption(),
    /**
     * Specifies a template literal from which to generate the `ResultLink` display title (see
     * [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)).
     *
     * This option overrides the default `ResultLink` display title behavior.
     *
     * The template literal can reference any number of fields from the parent result. However, if the template literal
     * references a key whose value is undefined in the parent result fields, the `ResultLink` title displays the
     * name of this key instead.
     *
     * This option is ignored if the `ResultLink` innerHTML contains any value.
     *
     * **Examples:**
     *
     * - The following markup generates a `ResultLink` display title such as `Case number: 123456` if both the
     * `raw.objecttype` and `raw.objectnumber` keys are defined in the parent result fields:
     *
     * ```html
     * <a class="CoveoResultLink" data-title-template="${raw.objecttype} number: ${raw.objectnumber}"></a>
     * ```
     *
     * - The following markup generates `${myField}` as a `ResultLink` display title if the `myField` key is undefined
     * in the parent result fields:
     *
     * ```html
     * <a class="CoveoResultLink" data-title-template="${myField}"></a>
     * ```
     *
     * - The following markup generates `Foobar` as a `ResultLink` display title, because the `ResultLink` innterHTML is
     * not empty:
     *
     * ```html
     * <a class="CoveoResultLink" data-title-template="${will} ${be} ${ignored}">Foobar</a>
     * ```
     *
     * Default value is `undefined`.
     */
    titleTemplate: ComponentOptions_1.ComponentOptions.buildStringOption(),
    /**
     * Specifies an event handler function to execute when the user clicks the `ResultLink` component.
     *
     * The handler function takes a JavaScript [`Event`](https://developer.mozilla.org/en/docs/Web/API/Event) object and
     * an [`IQueryResult`]{@link IQueryResult} as its parameters.
     *
     * Overriding the default behavior of the `onClick` event can allow you to execute specific code instead.
     *
     * **Note:**
     * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
     * > [`init`]{@link init} call of your search interface (see
     * > [Components - Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
     * > or before the `init` call, using the `options` top-level function (see
     * > [Components - Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
     *
     * **Example:**
     * ```javascript
     *
     *
     *
     * // You can set the option in the 'init' call:
     * Coveo.init(document.querySelector("#search"), {
     *   ResultLink : {
     *     onClick : function(e, result) {
     *       e.preventDefault();
     *       // Custom code to execute with the item URI and title.
     *       openUriInASpecialTab(result.clickUri, result.title);
     *     }
     *   }
     * });
     *
     * // Or before the 'init' call, using the 'options' top-level function:
     * // Coveo.options(document.querySelector('#search'), {
     * //   ResultLink : {
     * //     onClick : function(e, result) {
     * //       e.preventDefault();
     * //       // Custom code to execute with the item URI and title.
     * //       openUriInASpecialTab(result.clickUri, result.title);
     * //     }
     * //   }
     * // });
     * ```
     */
    onClick: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
        return null;
    })
};
exports.ResultLink = ResultLink;
Initialization_1.Initialization.registerAutoCreateComponent(ResultLink);


/***/ })

});
//# sourceMappingURL=Backdrop.js.map