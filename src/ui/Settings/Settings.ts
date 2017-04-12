import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { InitializationEvents } from '../../events/InitializationEvents';
import { $$ } from '../../utils/Dom';
import { PopUp, IPosition, HorizontalAlignment, VerticalAlignment } from '../../utils/PopUp';
import { IMenuItem } from '../Menu/MenuItem';
import { SettingsEvents } from '../../events/SettingsEvents';
import { Initialization } from '../Base/Initialization';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_Settings';

export interface ISettingsPopulateMenuArgs {
  settings: Settings;
  menuData: IMenuItem[];
}

export interface ISettingsOptions {
  menuDelay: number;
}

/**
 * The Settings component renders a **Settings** button that the end user can click to access a popup menu from which
 * it is possible to perform several contextual actions. The usual location of the **Settings** button in the page is to
 * the right of the {@link Searchbox}.
 *
 * This component can reference several components to populate its popup menu:
 * - {@link AdvancedSearch}
 * - {@link ExportToExcel}
 * - {@link PreferencesPanel} (see also {@link ResultsFiltersPreferences} and {@link ResultsPreferences})
 * - {@link SearchAlerts} (see also {@link SearchAlertsMessage})
 * - {@link ShareQuery}
 */
export class Settings extends Component {
  static ID = 'Settings';

  static doExport = () => {
    exportGlobally({
      'Settings': Settings
    });
  }


  /**
   * The options for Settings
   * @componentOptions
   */
  static options: ISettingsOptions = {

    /**
     * Specifies the delay (in milliseconds) before hiding the popup menu when the cursor is not hovering over it.
     *
     * Default value is `300`. Minimum value is `0 `.
     */
    menuDelay: ComponentOptions.buildNumberOption({ defaultValue: 300, min: 0 })
  };

  private menu: HTMLElement;
  private closeTimeout: number;
  private isOpened: boolean = false;

  /**
   * Creates a new Settings component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Settings component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options: ISettingsOptions, bindings?: IComponentBindings) {
    super(element, Settings.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Settings, options);
    this.bind.onRootElement(InitializationEvents.afterInitialization, () => this.init());
  }

  /**
   * Opens the **Settings** popup menu.
   */
  public open() {
    this.isOpened = true;
    if (this.menu != null) {
      $$(this.menu).detach();
    }
    this.menu = this.buildMenu();
    let popUp = new PopUp(this.menu, this.root, this.element, () => { this.isOpened = false; });
    popUp.positionPopup(this.element, this.root, this.getPopupPositioning(), this.root);

  }

  /**
   * Closes the **Settings** popup menu.
   */
  public close() {
    this.isOpened = false;
    if (this.menu != null) {
      $$(this.menu).detach();
      this.menu = null;
    }
  }

  private init() {
    if (this.searchInterface.isNewDesign()) {
      var square = $$('span', { className: 'coveo-settings-square' }).el;
      var squares = $$('span', { className: 'coveo-settings-squares' }).el;
      _.times(3, () => squares.appendChild(square.cloneNode()));
      this.element.appendChild(squares);
    } else {
      var icon = $$('span', { className: 'coveo-settings-icon' }).el;
      this.element.appendChild(icon);
    }

    $$(this.element).on('click', () => {
      if (this.isOpened) {
        this.close();
      } else {
        this.open();
      }
    });
  }

  private buildMenu(): HTMLElement {
    var menu = $$('div', { className: 'coveo-settings-advanced-menu' }).el;
    var settingsPopulateMenuArgs: ISettingsPopulateMenuArgs = {
      settings: this,
      menuData: []
    };
    $$(this.root).trigger(SettingsEvents.settingsPopulateMenu, settingsPopulateMenuArgs);
    _.each(settingsPopulateMenuArgs.menuData, (menuItem) => {
      var menuItemDom = $$('div', {
        className: `coveo-settings-item ${menuItem.className}`,
        title: _.escape(menuItem.tooltip || '')
      }).el;
      menuItemDom.appendChild($$('div', { className: 'coveo-icon' }).el);
      menuItemDom.appendChild($$('div', { className: 'coveo-settings-text' }, _.escape(menuItem.text)).el);
      $$(menuItemDom).on('click', () => {
        this.close();
        _.each(settingsPopulateMenuArgs.menuData, (menuItem) => {
          menuItem.onClose && menuItem.onClose();
        });
        menuItem.onOpen();
      });
      menu.appendChild(menuItemDom);
    });
    return menu;
  }

  private getPopupPositioning(): IPosition {
    return {
      horizontal: HorizontalAlignment.INNERRIGHT,
      vertical: VerticalAlignment.BOTTOM,
      verticalOffset: 8
    };
  }
}
Initialization.registerAutoCreateComponent(Settings);
