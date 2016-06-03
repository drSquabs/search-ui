import {IFieldDescription} from '../../rest/FieldDescription';
import {IComponentDefinition} from './Component';
import {Assert} from '../../misc/Assert';
import {Template} from '../Templates/Template';
import {$$} from '../../utils/Dom';
import {LazyTemplate} from '../Templates/LazyTemplate';
import {TemplateCache} from '../Templates/TemplateCache';
import {TemplateList} from '../Templates/TemplateList';
import {UnderscoreTemplate} from '../Templates/UnderscoreTemplate';
import {HtmlTemplate} from '../Templates/HtmlTemplate';
import {Utils} from '../../utils/Utils';
import _ = require('underscore');

export interface ILoadOption<T> {
  (element: HTMLElement, name: string, option: IOption<T>): T
}

export interface IPostProcessing<T> {
  (value: T, options: any): T
}

export interface IOption<T> extends IOptionArgs<T> {
  type?: Type;
  load?: ILoadOption<T>;
}

export interface IOptionArgs<T> {
  defaultValue?: T;
  defaultFunction?: (element: HTMLElement) => T;
  required?: boolean;
  postProcessing?: IPostProcessing<T>;
  attrName?: string;
  section?: string;
  depend?: string;
  priority?: number;
}

export interface INumberOption extends IOption<number>, INumberOptionArgs {
}
export interface INumberOptionArgs extends IOptionArgs<number> {
  min?: number;
  max?: number;
  float?: boolean;
}

export interface IListOption extends IOption<string[]>, IListOptionArgs {
}
export interface IListOptionArgs extends IOptionArgs<string[]> {
  separator?: RegExp;
  values?: any;
}

export interface IChildHtmlElementOption extends IOption<HTMLElement>, IChildHtmlElementOptionArgs {
}
export interface IChildHtmlElementOptionArgs extends IOptionArgs<HTMLElement> {
  selectorAttr?: string;
  childSelector?: string;
}

export interface ITemplateOption extends IOption<Template>, ITemplateOptionArgs {
}
export interface ITemplateOptionArgs extends IOptionArgs<Template> {
  selectorAttr?: string;
  childSelector?: string;
  idAttr?: string;
  // CAREFULL WITH LAZY: This disable the option to use init option for this option
  lazy?: boolean;
}

export interface IFieldOption extends IOption<string>, IFieldOptionArgs {
}
export interface IFieldOptionArgs extends IOptionArgs<string> {
  groupByField?: boolean;
  includeInResults?: boolean;
  sortByField?: boolean;
  splitGroupByField?: boolean;
  match?: (field: IFieldDescription) => boolean;
}

export interface IFieldsOption extends IOption<string[]>, IFieldsOptionArgs {
}
export interface IFieldsOptionArgs extends IOptionArgs<string[]> {
  groupByField?: boolean;
  includeInResults?: boolean;
  sortByField?: boolean;
  splitGroupByField?: boolean;
  match?: (field: IFieldDescription) => boolean;
}

export interface IObjectOption extends IOption<{ [key: string]: any }>, IObjectOptionArgs {
}
export interface IObjectOptionArgs extends IOptionArgs<{ [key: string]: any }> {
  subOptions: { [key: string]: IOption<any> };
}

export enum Type {
  BOOLEAN,
  NUMBER,
  STRING,
  LOCALIZED_STRING,
  LIST,
  SELECTOR,
  CHILD_HTML_ELEMENT,
  TEMPLATE,
  FIELD,
  FIELDS,
  ICON,
  OBJECT,
  QUERY,
  HELPER,
  LONG_STRING,
  JSON,
  JAVASCRIPT,
  NONE
}

const camelCaseToHyphenRegex = /([A-Z])|\W+(\w)/g;
const fieldsSeperator = /\s*,\s*/;
const localizer = /([a-zA-Z\-]+)\s*:\s*(([^,]|,\s*(?!([a-zA-Z\-]+)\s*:))+)/g;

export class ComponentOptions {
  static buildBooleanOption(optionArgs?: IOptionArgs<boolean>): boolean {
    return ComponentOptions.buildOption<boolean>(Type.BOOLEAN, ComponentOptions.loadBooleanOption, optionArgs);
  }

  static buildNumberOption(optionArgs?: INumberOptionArgs): number {
    return ComponentOptions.buildOption<number>(Type.NUMBER, ComponentOptions.loadNumberOption, optionArgs);
  }

  static buildStringOption(optionArgs?: IOptionArgs<string>): string {
    return ComponentOptions.buildOption<string>(Type.STRING, ComponentOptions.loadStringOption, optionArgs);
  }

  static buildIconOption(optionArgs?: IOptionArgs<string>): string {
    return ComponentOptions.buildOption<string>(Type.ICON, ComponentOptions.loadStringOption, optionArgs);
  }

  static buildHelperOption(optionArgs?: IOptionArgs<string>): string {
    return ComponentOptions.buildOption<string>(Type.HELPER, ComponentOptions.loadStringOption, optionArgs);
  }

  static buildJsonOption(optionArgs?: IOptionArgs<string>): string {
    return ComponentOptions.buildOption<string>(Type.JSON, ComponentOptions.loadStringOption, optionArgs);
  }

  static buildLocalizedStringOption(optionArgs?: IOptionArgs<string>): string {
    return ComponentOptions.buildOption<string>(Type.LOCALIZED_STRING, ComponentOptions.loadLocalizedStringOption, optionArgs);
  }

  static buildFieldOption(optionArgs?: IFieldOptionArgs): string {
    return ComponentOptions.buildOption<string>(Type.FIELD, ComponentOptions.loadFieldOption, optionArgs);
  }

  static buildFieldsOption(optionArgs?: IFieldsOptionArgs): string[] {
    return ComponentOptions.buildOption<string[]>(Type.FIELDS, ComponentOptions.loadFieldsOption, optionArgs);
  }

  static buildListOption(optionArgs?: IListOptionArgs): string[] {
    return ComponentOptions.buildOption<string[]>(Type.LIST, ComponentOptions.loadListOption, optionArgs);
  }

  static buildSelectorOption(optionArgs?: IOptionArgs<HTMLElement>): HTMLElement {
    return ComponentOptions.buildOption<HTMLElement>(Type.SELECTOR, ComponentOptions.loadSelectorOption, optionArgs);
  }

  static buildChildHtmlElementOption(optionArgs?: IChildHtmlElementOptionArgs): HTMLElement {
    return ComponentOptions.buildOption<HTMLElement>(Type.CHILD_HTML_ELEMENT, ComponentOptions.loadChildHtmlElementOption, optionArgs);
  }

  static buildTemplateOption(optionArgs?: ITemplateOptionArgs): Template {
    return ComponentOptions.buildOption<Template>(Type.TEMPLATE, ComponentOptions.loadTemplateOption, optionArgs);
  }

  static buildCustomOption<T>(converter: (value: string) => T, optionArgs?: IOptionArgs<T>): T {
    let loadOption: ILoadOption<T> = (element: HTMLElement, name: string, option: IOption<T>) => {
      let stringvalue = ComponentOptions.loadStringOption(element, name, option);
      return converter(stringvalue);
    }
    return ComponentOptions.buildOption<T>(Type.STRING, loadOption, optionArgs);
  }

  static buildCustomListOption<T>(converter: (value: string[]) => T, optionArgs?: IListOptionArgs): T {
    let loadOption: ILoadOption<T> = (element: HTMLElement, name: string, option: any) => {
      let stringvalue = ComponentOptions.loadListOption(element, name, option);
      return converter(stringvalue);
    }
    return ComponentOptions.buildOption<any>(Type.LIST, loadOption, optionArgs);
  }

  static buildObjectOption(optionArgs?: IObjectOptionArgs): any {
    let loadOption: ILoadOption<{
      [key: string]: any
    }> = (element: HTMLElement, name: string, option: IOption<any>) => {
      let keys = _.keys(optionArgs.subOptions);
      let scopedOptions: {
        [name: string]: IOption<any>
      } = {};
      let scopedValues: {
        [name: string]: any
      } = {};
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let scopedkey = ComponentOptions.mergeCamelCase(name, key);
        scopedOptions[scopedkey] = optionArgs.subOptions[key];
      }
      ComponentOptions.initOptions(element, scopedOptions, scopedValues);
      let resultValues: {
        [name: string]: any
      } = {};
      let resultFound = false;
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let scopedkey = ComponentOptions.mergeCamelCase(name, key);
        if (scopedValues[scopedkey] != null) {
          resultValues[key] = scopedValues[scopedkey];
          resultFound = true;
        }
      }
      return resultFound ? resultValues : null;
    }
    return ComponentOptions.buildOption<{
      [key: string]: any
    }>(Type.OBJECT, loadOption, optionArgs);
  }

  static buildOption<T>(type: Type, load: ILoadOption<T>, optionArg: IOptionArgs<T> = {}): T {
    let option: IOption<T> = <any>optionArg;
    option.type = type;
    option.load = load;
    return <any>option;
  }

  static attrNameFromName(name: string, optionArgs?: IOptionArgs<any>) {
    if (optionArgs && optionArgs.attrName) {
      return optionArgs.attrName;
    }
    return 'data-' + ComponentOptions.camelCaseToHyphen(name);
  }

  static camelCaseToHyphen(name: string) {
    return name.replace(camelCaseToHyphenRegex, '-$1$2').toLowerCase();
  }

  static mergeCamelCase(parent: string, name: string) {
    return parent + name.substr(0, 1).toUpperCase() + name.substr(1)
  }

  static initComponentOptions(element: HTMLElement, component: any, values?: any) {
    return ComponentOptions.initOptions(element, component.options, values);
  }

  static initOptions(element: HTMLElement, options: {
    [name: string]: IOption<any>
  }, values?: any) {
    if (values == null) {
      values = {};
    }
    let names: string[] = _.keys(options);
    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      let optionDefinition = options[name];
      let attrName = optionDefinition.attrName = optionDefinition.attrName || ComponentOptions.attrNameFromName(name, optionDefinition);
      let value: any;
      let loadFromAttribute = optionDefinition.load;
      if (values[name] != undefined) {
        value = values[name];
      } else if (loadFromAttribute != null) {
        value = loadFromAttribute(element, name, optionDefinition);
      }
      if (value == null && values[name] == undefined) {
        if (optionDefinition.defaultValue != null) {
          if (optionDefinition.type == Type.LIST) {
            value = _.extend([], optionDefinition.defaultValue);
          } else if (optionDefinition.type == Type.OBJECT) {
            value = _.extend({}, optionDefinition.defaultValue);
          } else {
            value = optionDefinition.defaultValue;
          }
        } else if (optionDefinition.defaultFunction != null) {
          value = optionDefinition.defaultFunction(element);
        }
      }
      if (value != null) {
        if (optionDefinition.type == Type.OBJECT && values[name] != null) {
          values[name] = _.extend(values[name], value);
        } else {
          values[name] = value;
        }
      }
    }
    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      let optionDefinition = options[name];
      if (optionDefinition.postProcessing) {
        values[name] = optionDefinition.postProcessing(values[name], values);
      }
    }
    return values;
  }

  static loadStringOption(element: HTMLElement, name: string, option: IOption<any>): string {
    return element.getAttribute(ComponentOptions.attrNameFromName(name, option));
  }

  static loadFieldOption(element: HTMLElement, name: string, option: IOption<any>): string {
    let field = ComponentOptions.loadStringOption(element, name, option);
    Assert.check(!Utils.isNonEmptyString(field) || Utils.isCoveoField(field), field + ' is not a valid field');
    return field;
  }

  static loadFieldsOption(element: HTMLElement, name: string, option: IOption<any>): string[] {
    let fieldsAttr = ComponentOptions.loadStringOption(element, name, option);
    if (fieldsAttr == null) {
      return null;
    }
    let fields = fieldsAttr.split(fieldsSeperator);
    _.each(fields, (field: string) => {
      Assert.check(Utils.isCoveoField(field), field + ' is not a valid field');
    });
    return fields;
  }

  static loadLocalizedStringOption(element: HTMLElement, name: string, option: IOption<any>): string {
    let attributeValue = ComponentOptions.loadStringOption(element, name, option);
    let locale: string = String['locale'] || String['defaultLocale'];
    if (locale != null && attributeValue != null) {
      let localeParts = locale.toLowerCase().split('-');
      let locales = _.map(localeParts, (part, i) => localeParts.slice(0, i + 1).join('-'));
      let localizers = attributeValue.match(localizer);
      if (localizers != null) {
        for (let i = 0; i < localizers.length; i++) {
          let groups = localizer.exec(localizers[i]);
          if (groups != null) {
            let lang = groups[1].toLowerCase();
            if (_.contains(locales, lang)) {
              return groups[2].replace(/^\s+|\s+$/g, '');
            }
          }
        }
      }
      return attributeValue != null ? attributeValue.toLocaleString() : null;
    }
    return attributeValue;
  }

  static loadNumberOption(element: HTMLElement, name: string, option: INumberOption): number {
    let attributeValue = ComponentOptions.loadStringOption(element, name, option);
    if (attributeValue == null) {
      return null;
    }
    let numberValue = option.float === true ? Utils.parseFloatIfNotUndefined(attributeValue) : Utils.parseIntIfNotUndefined(attributeValue);
    if (option.min != null && option.min > numberValue) {
      numberValue = option.min;
    }
    if (option.max != null && option.max < numberValue) {
      numberValue = option.max;
    }
    return numberValue;
  }

  static loadBooleanOption(element: HTMLElement, name: string, option: IOption<any>): boolean {
    return Utils.parseBooleanIfNotUndefined(ComponentOptions.loadStringOption(element, name, option));
  }

  static loadListOption(element: HTMLElement, name: string, option: IListOption): string[] {
    let separator = option.separator || /\s*,\s*/;
    let attributeValue = ComponentOptions.loadStringOption(element, name, option);
    return Utils.isNonEmptyString(attributeValue) ? attributeValue.split(separator) : null;
  }

  static loadEnumOption(element: HTMLElement, name: string, option: IOption<any>, _enum: any): number {
    let enumAsString = ComponentOptions.loadStringOption(element, name, option);
    return enumAsString != null ? _enum[enumAsString] : null;
  }

  static loadSelectorOption(element: HTMLElement, name: string, option: IOption<any>): HTMLElement {
    let attributeValue = ComponentOptions.loadStringOption(element, name, option)
    return Utils.isNonEmptyString(attributeValue) ? <HTMLElement>document.querySelector(attributeValue) : null;
  }

  static loadChildHtmlElementOption(element: HTMLElement, name: string, option: IChildHtmlElementOption): HTMLElement {
    let htmlElement: HTMLElement;
    // Attribute: selector
    let selectorAttr = option.selectorAttr || ComponentOptions.attrNameFromName(name, option) + '-selector';
    let selector = element.getAttribute(selectorAttr);
    if (selector != null) {
      htmlElement = <HTMLElement>document.body.querySelector(selector);
    }
    // Child
    if (htmlElement == null) {
      let childSelector = option.childSelector;
      if (childSelector == null) {
        childSelector = '.' + name;
      }
      htmlElement = ComponentOptions.loadChildHtmlElementFromSelector(element, childSelector);
    }
    return htmlElement;
  }

  static loadChildHtmlElementFromSelector(element: HTMLElement, selector: string): HTMLElement {
    Assert.isNonEmptyString(selector);
    if ($$(element).is(selector)) {
      return element;
    }
    return <HTMLElement>$$(element).find(selector);
  }

  static loadChildrenHtmlElementFromSelector(element: HTMLElement, selector: string): HTMLElement[] {
    Assert.isNonEmptyString(selector);
    return $$(element).findAll(selector);
  }

  static loadTemplateOption(element: HTMLElement, name: string, option: ITemplateOption): Template {
    if (option.lazy) {
      return new LazyTemplate(element, name, option);
    }

    let template: Template;

    // Attribute: template selector
    let selectorAttr = option.selectorAttr || ComponentOptions.attrNameFromName(name, option) + '-selector';
    let selector = element.getAttribute(selectorAttr);
    if (selector != null) {
      let templateElement = <HTMLElement>document.querySelector(selector);
      if (templateElement != null) {
        template = ComponentOptions.createResultTemplateFromElement(templateElement);
      }
    }
    // Attribute: template id
    if (template == null) {
      let idAttr = option.idAttr || ComponentOptions.attrNameFromName(name, option) + '-id';
      let id = element.getAttribute(idAttr);
      if (id != null) {
        template = ComponentOptions.loadResultTemplateFromId(id);
      }
    }
    // Child
    if (template == null) {
      let childSelector = option.childSelector;
      if (childSelector == null) {
        childSelector = '.' + name.replace(/([A-Z])/g, '-$1').toLowerCase();
      }
      template = ComponentOptions.loadChildrenResultTemplateFromSelector(element, childSelector);
    }
    return template;
  }

  static loadResultTemplateFromId(templateId: string): Template {
    return Utils.isNonEmptyString(templateId) ? TemplateCache.getTemplate(templateId) : null;
  }

  static loadChildrenResultTemplateFromSelector(element: HTMLElement, selector: string): Template {
    let foundElements = ComponentOptions.loadChildrenHtmlElementFromSelector(element, selector);
    if (foundElements.length > 0) {
      return new TemplateList(_.compact(_.map(foundElements, (element) => ComponentOptions.createResultTemplateFromElement(element))));
    }
    return null;
  }

  static findParentScrolling(element: HTMLElement): HTMLElement {
    while (<Node>element != document && element != null) {
      if (ComponentOptions.isElementScrollable(element)) {
        if (element.tagName == 'body') {
          return element;
        }
        return <any>window;
      }
      element = element.parentElement;
    }
    return <any>window;
  }

  static isElementScrollable(element: HTMLElement) {
    return $$(element).css('overflow-y') == 'scroll';
  }

  static createResultTemplateFromElement(element: HTMLElement): Template {
    Assert.exists(element);
    let type = element.getAttribute('type');
    let mimeTypes = 'You must specify the type of template. Valid values are :' +
      ' ' + UnderscoreTemplate.mimeTypes.toString() +
      ' ' + HtmlTemplate.mimeTypes.toString()
    Assert.check(Utils.isNonEmptyString(type), mimeTypes);

    if (_.indexOf(UnderscoreTemplate.mimeTypes, type) != -1) {
      return UnderscoreTemplate.create(element);
    } else if (_.indexOf(HtmlTemplate.mimeTypes, type) != -1) {
      return new HtmlTemplate(element);
    } else {
      Assert.fail('Cannot guess template type from attribute: ' + type + '. Valid values are ' + mimeTypes);
      return undefined;
    }
  }
}