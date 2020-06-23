
/**
 * @typedef ExpressionLanguageDescriptor
 * @property {string} value - value inserted into XML
 * @property {string} label - human-readable label
 */

/**
 * Provide options and defaults of expression languages via config.
 *
 * @example
 *
 * // there will be two languages available with FEEL as default
 * const editor = new DmnJS({
 *   expressionLanguages: {
 *     options: [{
 *       value: 'feel',
 *       label: 'FEEL'
 *     }, {
 *       value: 'juel',
 *       label: 'JUEL'
 *     }],
 *     defaults: {
 *       editor: 'feel'
 *     }
 *   }
 * })
 */
export default class InputSources {
  constructor(injector) {
    this._injector = injector;

    this._config = injector.get('config.inputSources') || {};
  }

  /**
   * Get default expression language for a component or the editor if `componentName`
   * is not provided.
   *
   * @param {string} [componentName]
   * @returns {ExpressionLanguageDescriptor}
   */
  getDefault(componentName) {
    const { defaults } = this._config;
    const defaultFromConfig = defaults[componentName] || defaults.editor;

    return this._getLanguageByValue(defaultFromConfig) || this.getAll()[0];
  }

  /**
   * Get label for provided expression language.
   *
   * @param {string} expressionLanguageValue - value from XML
   * @returns {string}
   */
  getLabel(expressionLanguageValue) {
    const langauge = this._getLanguageByValue(expressionLanguageValue);

    return langauge ? langauge.label : expressionLanguageValue;
  }

  /**
   * Get list of configured expression languages.
   *
   * @returns {ExpressionLanguageDescriptor[]}
   */
  getAll() {
    return Object.keys(this._config).map(e=> ({ label: e, value: e }));
  }

  getProperties(key) {
    return Object.keys(this._config[key] ||{}).map(e=> ({ label: e, value: e }));
  }
}

InputSources.$inject = [ 'injector' ];
